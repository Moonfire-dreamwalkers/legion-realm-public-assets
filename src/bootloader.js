// Legion Realm — Dynamic CDN Bootloader for Zero-Stale CDN Streaming
// Shared across all pages. Replaces previously duplicated inline script.
(function () {
  var isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

  function loadStyle(href, id) {
    return new Promise(function (resolve) {
      var link = id ? document.getElementById(id) : null;
      if (link) {
        link.href = href;
        var resolved = false;
        var done = function () { if (!resolved) { resolved = true; resolve(); } };
        link.onload = done;
        link.onerror = done;
        setTimeout(done, 150);
      } else {
        link = document.createElement('link');
        if (id) link.id = id;
        link.rel = 'stylesheet';
        link.href = href;
        link.onload = resolve;
        link.onerror = resolve;
        document.head.appendChild(link);
      }
    });
  }

  function loadScript(src, defer) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      if (defer) s.defer = true;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  if (isLocal) {
    window.LR_BUILD_VERSION = 'local';
    var cb = '?t=' + Date.now();
    Promise.all([
      loadStyle('src/styles/theme.css' + cb, 'lr-theme-css'),
      loadStyle('src/styles/site.css' + cb, 'lr-site-css'),
      loadStyle('src/styles/auth.css' + cb, 'lr-auth-css')
    ]).then(function () {
      return loadScript('src/data/config.js' + cb);
    }).then(function () {
      return loadScript('src/app.js' + cb);
    }).then(function () {
      return loadScript('src/auth.js' + cb);
    });
  } else {
    var version = 'main';
    var versionMismatch = false;
    fetch('https://raw.githubusercontent.com/Moonfire-dreamwalkers/legion-realm-public-assets/main/build-version.json?t=' + Date.now(), { cache: 'no-store' })
      .then(function (res) {
        if (res.ok) return res.json();
        throw new Error('Version fetch failed');
      })
      .then(function (data) {
        if (data && data.version) {
          version = data.version;
          var activeVersion = localStorage.getItem('lr_active_build_version');
          if (activeVersion && activeVersion !== version) {
            versionMismatch = true;
          }
          if (!versionMismatch) {
            localStorage.setItem('lr_active_build_version', version);
          }
        }
        return handleVersion(version, versionMismatch);
      })
      .catch(function (e) {
        console.warn('CDN bootloader failed to fetch latest version tag, using @main fallback:', e);
        handleVersion(version, false);
      });

    function handleVersion(ver, mismatch) {
      if (mismatch) {
        document.body.style.opacity = '0';
        if ('caches' in window) {
          caches.keys().then(function (keys) {
            return Promise.all(keys.map(function (key) { return caches.delete(key); }));
          }).then(function () {
            if ('serviceWorker' in navigator) {
              return navigator.serviceWorker.getRegistrations().then(function (regs) {
                return Promise.all(regs.map(function (r) { return r.update(); }));
              });
            }
          }).then(function () {
            localStorage.setItem('lr_active_build_version', ver);
            console.log('Cleared stale cache due to build mismatch, reloading...');
            window.location.reload(true);
          }).catch(function (err) {
            console.error('Failed to clear cache on version mismatch:', err);
          });
        } else {
          localStorage.setItem('lr_active_build_version', ver);
        }
        return;
      }

      window.LR_BUILD_VERSION = ver;
      var safeVer = ver.replace(/[^a-zA-Z0-9._-]/g, '').substring(0, 64);
      var base = 'https://cdn.jsdelivr.net/gh/Moonfire-dreamwalkers/legion-realm-public-assets@' + safeVer;
      Promise.all([
        loadStyle(base + '/src/styles/theme.css', 'lr-theme-css'),
        loadStyle(base + '/src/styles/site.css', 'lr-site-css'),
        loadStyle(base + '/src/styles/auth.css', 'lr-auth-css')
      ]).then(function () {
        return loadScript(base + '/src/data/config.js');
      }).then(function () {
        return loadScript(base + '/src/app.js');
      }).then(function () {
        return loadScript(base + '/src/auth.js');
      });
    }
  }
})();