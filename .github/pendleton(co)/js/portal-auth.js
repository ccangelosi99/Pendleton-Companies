/**
 * PENDLETON COMPANIES - PORTAL AUTH (Mock)
 * Handles demo sign-in + password reset flows
 */
'use strict';

function ensureStatusEl(form) {
  let status = form.querySelector('.portal-login-status');
  if (!status) {
    status = document.createElement('div');
    status.className = 'portal-login-status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    form.appendChild(status);
  }
  return status;
}

function setStatus(form, message, type) {
  const status = ensureStatusEl(form);
  status.className = 'portal-login-status';
  if (type === 'success') status.classList.add('portal-login-status--success');
  if (type === 'error') status.classList.add('portal-login-status--error');
  if (type === 'info') status.classList.add('portal-login-status--info');
  status.textContent = message;
}

function isOtpValid(otp) {
  if (!otp) return true;
  return /^\d{6}$/.test(otp);
}

function simulateRequest(delay = 900) {
  return new Promise(resolve => setTimeout(resolve, delay));
}

function attachLoginFlows() {
  document.querySelectorAll('.portal-login-form').forEach(form => {
    form.addEventListener('submit', async event => {
      event.preventDefault();

      const account = form.dataset.account || 'Portal';
      const emailInput = form.querySelector('input[name="email"]');
      const passwordInput = form.querySelector('input[name="password"]');
      const otpInput = form.querySelector('input[name="otp"]');
      const submitBtn = form.querySelector('button[type="submit"]');

      const email = (emailInput?.value || '').trim();
      const password = passwordInput?.value || '';
      const otp = (otpInput?.value || '').trim();

      if (!email || !password) {
        setStatus(form, 'Enter both email and password to continue.', 'error');
        return;
      }

      if (!isOtpValid(otp)) {
        setStatus(form, 'Verification code must be exactly 6 digits.', 'error');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.originalText = submitBtn.textContent;
        submitBtn.textContent = 'Signing In...';
      }
      setStatus(form, `Authenticating ${account.toLowerCase()} account...`, 'info');

      await simulateRequest();

      const shouldFail = password.length < 8 || email.toLowerCase().includes('fail');
      if (shouldFail) {
        setStatus(form, 'Sign-in failed in demo mode. Use password with 8+ characters and a valid email.', 'error');
      } else {
        setStatus(form, 'Sign-in successful (demo). Redirecting to portal home...', 'success');
        setTimeout(() => {
          window.location.href = '../../pages/portal/index.html';
        }, 1100);
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtn.dataset.originalText || 'Sign In';
      }
    });
  });
}

function attachResetFlows() {
  document.querySelectorAll('.portal-reset-form').forEach(form => {
    form.addEventListener('submit', async event => {
      event.preventDefault();

      const account = form.dataset.account || 'Portal';
      const emailInput = form.querySelector('input[name="email"]');
      const email = (emailInput?.value || '').trim();
      const submitBtn = form.querySelector('button[type="submit"]');

      if (!email) {
        setStatus(form, 'Enter your account email to reset password.', 'error');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.dataset.originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
      }
      setStatus(form, `Sending reset instructions for ${account.toLowerCase()} access...`, 'info');

      await simulateRequest(800);

      setStatus(
        form,
        `Reset link sent (demo) to ${email}. Check your inbox for ${account.toLowerCase()} password reset instructions.`,
        'success'
      );

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtn.dataset.originalText || 'Send Reset Link';
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  attachLoginFlows();
  attachResetFlows();
});
