import { crumbsHtml } from '../../tools/lib.mjs'

// same text as the privacy dialog on the homepage
export default {
  path: 'privacy', nav: '',
  title: 'Privacy Notice',
  desc: 'How DPY Mercantile Inc. and Gratek Smart Water Corp. handle the details you share on this website, under the Data Privacy Act of 2012.',
  crumbs: [['Privacy notice']],
  noCta: true,
  css: `
.doc{max-width:760px}
.doc h2{margin:34px 0 8px;font-size:19px;font-weight:600;letter-spacing:-.02em}
.doc p,.doc li{font-size:15.5px;line-height:1.7;color:var(--ink2)}
.doc p{margin:0}.doc ul{margin:0;padding-left:20px}
.doc a{color:var(--blue);font-weight:600}
.doc .upd{margin-top:34px;font-size:13px;color:var(--mute)}
`,
  body: R => `
<section class="phead" style="padding-bottom:40px">
  <div class="wrap">${crumbsHtml(R, [['Privacy notice']])}<span class="kick">Privacy</span><h1 class="thin h1">Privacy Notice</h1><p class="lede">How DPY Mercantile Inc. handles the details you share on this website, under the Data Privacy Act of 2012 (RA 10173).</p></div>
</section>
<section class="sec" style="padding-top:40px">
  <div class="wrap doc">
    <h2>Who we are</h2><p>DPY Mercantile Inc., 778-B Mahogany St., Octagon Village, Brgy. Dela Paz, Pasig City, together with its home and retail company, Gratek Smart Water Corp.</p>
    <h2>What we collect</h2><ul><li>Your name, mobile number and email address</li><li>Details about your building and hot water needs (building type, number of showers, branch, message)</li><li>The products in your quote list and your answers to the water heater finder, if you send them with your request</li><li>For service requests: your address and details about your heater</li></ul>
    <h2>Why we use it</h2><ul><li>To prepare your quotation and recommend the right water heater</li><li>To call or message you about your request and arrange a site visit or service</li><li>To provide installation and after-sales service if you become a customer</li></ul>
    <p style="margin-top:10px">We use it only for these purposes. We do not sell your details or use them for unrelated marketing.</p>
    <h2>What stays in your browser</h2><p>Your quote list is saved only in your own browser, so it's still there when you come back. It isn't sent to us until you send a request. You can clear it any time from the contact page.</p>
    <h2>Who can see it</h2><p>Only the DPY and Gratek staff handling your request, and our website hosting and email providers, who are bound by confidentiality and data-sharing agreements.</p>
    <h2>How long we keep it</h2><p>For up to five (5) years after your last transaction with us, or longer only if the law requires it. After that it is securely deleted.</p>
    <h2>Your rights</h2><p>You may ask to see, correct or delete your details, object to their use, or withdraw your consent at any time by emailing our Data Protection Officer at <a href="mailto:privacy@dpymi.com.ph?subject=Data%20privacy%20request">privacy@dpymi.com.ph</a>. You can also complain to the National Privacy Commission (privacy.gov.ph).</p>
    <p class="upd">Last updated: October 2026</p>
  </div>
</section>`,
}
