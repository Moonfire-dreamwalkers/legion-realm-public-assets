/**
 * UTM Tracker — Legion Realm
 * Captures UTM parameters from URL and stores them for tracking across the SPA.
 * Pairs with GA4 custom dimensions and the /api/auth/visit endpoint.
 * 
 * Supported parameters: utm_source, utm_medium, utm_campaign, utm_content, utm_term
 * 
 * UTM link examples for sharing across platforms:
 * 
 *   Discord:   ?utm_source=discord&utm_medium=social&utm_campaign=server_invite&utm_content=general_chat
 *   Facebook:  ?utm_source=facebook&utm_medium=social&utm_campaign=group_post&utm_content=post_123
 *   Instagram: ?utm_source=instagram&utm_medium=social&utm_campaign=bio_link
 *   Reddit:    ?utm_source=reddit&utm_medium=social&utm_campaign=subreddit_post
 *   TikTok:    ?utm_source=tiktok&utm_medium=social&utm_campaign=profile_bio
 *   YouTube:   ?utm_source=youtube&utm_medium=video&utm_campaign=video_description
 *   Bio Link:  ?utm_source=bio&utm_medium=referral&utm_campaign=linktree
 *   Partner:   ?utm_source=partner_site&utm_medium=referral&utm_campaign=cross_promo
 */
(function () {
  'use strict';

  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  var STORAGE_KEY = 'lr_utm';
  var FIRST_TOUCH_KEY = 'lr_utm_first_touch';

  function getQueryParams() {
    var params = {};
    var search = window.location.search.substring(1);
    if (!search) return params;
    var pairs = search.split('&');
    for (var i = 0; i < pairs.length; i++) {
      var kv = pairs[i].split('=');
      if (kv.length === 2) {
        var key = decodeURIComponent(kv[0].replace(/\+/g, ' '));
        var val = decodeURIComponent(kv[1].replace(/\+/g, ' '));
        params[key] = val;
      }
    }
    return params;
  }

  function parseUtmParams(rawParams) {
    var utm = {};
    for (var i = 0; i < UTM_KEYS.length; i++) {
      var key = UTM_KEYS[i];
      if (rawParams[key]) {
        utm[key] = rawParams[key];
      }
    }
    return utm;
  }

  function storeUtm(utm) {
    if (Object.keys(utm).length === 0) return;
    // Store current UTM for this session
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utm));
    } catch (e) {
      // sessionStorage unavailable — silently skip
    }
    // Store first-touch UTM if not already set
    try {
      var existingFirst = localStorage.getItem(FIRST_TOUCH_KEY);
      if (!existingFirst) {
        localStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(utm));
      }
    } catch (e) {
      // localStorage unavailable — silently skip
    }
  }

  function attachUtmToGtag(utm) {
    if (typeof gtag !== 'function') return;
    var dims = {};
    if (utm.utm_source) dims.dimension1 = utm.utm_source;
    if (utm.utm_medium) dims.dimension2 = utm.utm_medium;
    if (utm.utm_campaign) dims.dimension3 = utm.utm_campaign;
    if (utm.utm_content) dims.dimension4 = utm.utm_content;
    if (utm.utm_term) dims.dimension5 = utm.utm_term;
    if (Object.keys(dims).length > 0) {
      try {
        gtag('set', 'user_properties', dims);
      } catch (e) {
        // GA not available — silently skip
      }
    }
  }

  function forwardUtmToLinks() {
    // Attach UTM params to outbound links for cross-domain tracking
    try {
      var utmStr = sessionStorage.getItem(STORAGE_KEY);
      if (!utmStr) return;
      var utm = JSON.parse(utmStr);
      var params = [];
      for (var i = 0; i < UTM_KEYS.length; i++) {
        var key = UTM_KEYS[i];
        if (utm[key]) {
          params.push(encodeURIComponent(key) + '=' + encodeURIComponent(utm[key]));
        }
      }
      if (params.length === 0) return;
      var utmSuffix = params.join('&');
      
      // Attach to all external links
      var links = document.querySelectorAll('a[href^="http"]');
      for (var j = 0; j < links.length; j++) {
        var href = links[j].getAttribute('href');
        if (href && href.indexOf('utm_source') === -1) {
          links[j].setAttribute('href', href + (href.indexOf('?') === -1 ? '?' : '&') + utmSuffix);
        }
      }
    } catch (e) {
      // silently skip
    }
  }

  // ── INIT ──────────────────────────────────────────────
  var rawParams = getQueryParams();
  var utm = parseUtmParams(rawParams);
  storeUtm(utm);
  
  // Attach to GA4 once it loads
  if (Object.keys(utm).length > 0) {
    var checkGtag = setInterval(function () {
      if (typeof gtag === 'function') {
        attachUtmToGtag(utm);
        clearInterval(checkGtag);
      }
    }, 200);
    // Stop checking after 5 seconds
    setTimeout(function () { clearInterval(checkGtag); }, 5000);
  }

  // Forward UTM to outbound links once DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', forwardUtmToLinks);
  } else {
    forwardUtmToLinks();
  }
})();