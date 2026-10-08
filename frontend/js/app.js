    (function () {
      var overlays = document.querySelectorAll('.overlay');
      function openOverlay(id) {
        document.getElementById(id).classList.add('open');
        document.body.style.overflow = 'hidden';
      }
      function closeOverlay(id) {
        document.getElementById(id).classList.remove('open');
        document.body.style.overflow = '';
        if (id === 'paymentOverlay') {
          document.getElementById('payState').classList.remove('hide');
          document.getElementById('successState').classList.remove('show');
          document.getElementById('successRing').classList.remove('animate');
        }
      }
      document.querySelectorAll('[data-close]').forEach(function (button) {
        button.addEventListener('click', function () { closeOverlay(button.dataset.close); });
      });
      overlays.forEach(function (overlay) {
        overlay.addEventListener('click', function (event) { if (event.target === overlay) closeOverlay(overlay.id); });
      });
      document.addEventListener('keydown', function (event) { if (event.key === 'Escape') overlays.forEach(function (o) { if (o.classList.contains('open')) closeOverlay(o.id); }); });

      document.querySelectorAll('.pay-trigger').forEach(function (button) {
        button.addEventListener('click', function () { openOverlay('paymentOverlay'); });
      });
      document.getElementById('confirmPayment').addEventListener('click', function () {
        document.getElementById('payState').classList.add('hide');
        document.getElementById('successState').classList.add('show');
        document.getElementById('successRing').classList.add('animate');
      });

      var upi = document.getElementById('upiMode');
      var international = document.getElementById('internationalMode');
      function setMode(isInternational) {
        international.classList.toggle('active', isInternational);
        upi.classList.toggle('active', !isInternational);
        international.setAttribute('aria-selected', isInternational ? 'true' : 'false');
        upi.setAttribute('aria-selected', isInternational ? 'false' : 'true');
        document.getElementById('paymentEyebrow').textContent = isInternational ? 'International Pay' : 'UPI in India';
        document.getElementById('paymentHeading').textContent = isInternational ? 'Ready to Pay' : 'Everyday UPI';
        document.getElementById('paymentCopy').textContent = isInternational ? 'Use supported international QR infrastructure or NFC where available.' : 'Pay contacts and Indian merchants through your usual UPI experience.';
      }
      upi.addEventListener('click', function () { setMode(false); });
      international.addEventListener('click', function () { setMode(true); });

      document.getElementById('askBtn').addEventListener('click', function () { openOverlay('assistantOverlay'); });
      document.querySelector('[data-nav="AI"]').addEventListener('click', function () { openOverlay('assistantOverlay'); });
      document.querySelector('[data-nav="Pay"]').addEventListener('click', function () { openOverlay('paymentOverlay'); });
      document.querySelectorAll('.nav-btn').forEach(function (button) {
        button.addEventListener('click', function () {
          document.querySelectorAll('.nav-btn').forEach(function (b) { b.classList.remove('active'); });
          button.classList.add('active');
          if (button.dataset.nav === 'Travel') document.querySelector('.assistant-card').scrollIntoView({ behavior: 'smooth', block: 'center' });
          if (button.dataset.nav === 'Profile') document.querySelector('.topline').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
      var answer = document.getElementById('aiAnswer');
      var input = document.getElementById('assistantInput');
      function respond(text) {
        var q = text.toLowerCase();
        var response = 'I can help with currency previews, local payment options, merchant checks and payment support in this prototype.';
        if (q.indexOf('$15') > -1 || q.indexOf('entha') > -1 || q.indexOf('currency') > -1) response = '$15 is approximately ₹1,251 at the fixed sandbox rate of ₹83.40 per $1. A ₹25 demo fee makes the preview total ₹1,276. This is not a live quote.';
        else if (q.indexOf('restaurant') > -1 || q.indexOf('nearby') > -1) response = 'Nearby place search is a planned service module. This static prototype does not use your location or fetch live listings.';
        else if (q.indexOf('safe') > -1 || q.indexOf('merchant') > -1) response = 'Check the merchant name, amount and verification label before paying. Real verification would require an authorised payment partner; this demo only shows a sandbox status.';
        else if (q.indexOf('pending') > -1) response = 'A pending payment can happen while the payment network confirms the result. In a real app, check the transaction status before trying again to avoid a duplicate charge.';
        else if (q.indexOf('option') > -1) response = 'The international flow is designed for supported QR payments and NFC tap payments where partners and local infrastructure allow them.';
        answer.textContent = response;
        answer.style.display = 'block';
      }
      document.querySelectorAll('.chip').forEach(function (chip) { chip.addEventListener('click', function () { input.value = chip.textContent; respond(chip.textContent); }); });
      document.getElementById('sendQuestion').addEventListener('click', function () { if (input.value.trim()) respond(input.value.trim()); });
      input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && input.value.trim()) respond(input.value.trim()); });

      document.getElementById('convertBtn').addEventListener('click', function () { openOverlay('convertOverlay'); });
      document.getElementById('usdAmount').addEventListener('input', function () {
        var amount = parseFloat(this.value || '0');
        document.getElementById('inrAmount').value = '₹' + (amount * 83.4).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      });

      document.querySelectorAll('.service').forEach(function (button) {
        button.addEventListener('click', function () { document.getElementById('serviceMessage').textContent = button.dataset.service + ' is a planned module. Live listings are not connected in this prototype.'; });
      });

      var privacy = '<h3>What this prototype does</h3><p>This static prototype demonstrates payment and travel screens. It does not connect to a bank, payment partner, camera, location service or merchant network.</p><h3>Information entered here</h3><p>Questions and converter amounts remain in the open page for the current session. They are not saved by this prototype or sent to a server.</p><h3>Before a real launch</h3><p>A production service would need a full privacy notice covering identity checks, transaction records, location permissions, payment partners, retention, security and user rights under applicable law.</p>';
      var terms = '<h3>Prototype status</h3><p>This experience is a design prototype. It cannot send money, scan a real QR code, perform NFC payments, verify a merchant or provide a live exchange quote.</p><h3>Sandbox information</h3><p>Merchant names, transactions, conversion rates, fees and references shown here are illustrative sandbox data. They are not offers, receipts or financial advice.</p><h3>Production requirements</h3><p>Real international payments would require authorised banks, payment service providers, compliance checks and supported local payment infrastructure. Availability would depend on country, merchant and partner coverage.</p>';
      document.querySelectorAll('[data-policy]').forEach(function (button) {
        button.addEventListener('click', function () {
          var isPrivacy = button.dataset.policy === 'privacy';
          document.getElementById('policyTitle').textContent = isPrivacy ? 'Privacy' : 'Terms & Conditions';
          document.getElementById('policyCopy').innerHTML = isPrivacy ? privacy : terms;
          openOverlay('policyOverlay');
        });
      });
    })();
