(function () {
  const API_BASE = "http://127.0.0.1:3001";
  const LICENSE_API_BASE = "https://lovable-spark-saas.lovable.app";
  const VALIDATE_API = `${LICENSE_API_BASE}/api/public/license/validate`;
  const HEARTBEAT_API = `${LICENSE_API_BASE}/api/public/license/heartbeat`;
  const CURRENT_VERSION = "3.1.0";
  console.log("[EUBackend] ════════════════════════════════════════");
  console.log("[EUBackend] ║ admin-backend.js CARREGADO v3.0-DEV");
  console.log("[EUBackend] ║ API_BASE =", API_BASE);
  console.log("[EUBackend] ║ VALIDATE_API =", VALIDATE_API);
  console.log("[EUBackend] ║ Timestamp:", new Date().toISOString());
  console.log("[EUBackend] ════════════════════════════════════════");
  const LICENSE_ATTESTATION_PUBLIC_KEY_PEM = `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEfCJCYQQNMjD+kSYmiGZNHLIS/RD6
nR6l+pKev7sv6muX0ObtLqb4JfHl1DjK7bsZCmwWrj/GfLRfOk/Tz+FH1A==
-----END PUBLIC KEY-----`;

  function getLicenseKey(store) {
    return store.eu_license_key || store.ql_license_key || "";
  }

  function normalizeValidation(payload, key) {
    const license = payload && payload.license ? payload.license : {};
    const config = payload && payload.config ? payload.config : {};
    const brandName = config.brandName || config.brandText || license.bound_email || "Lovable";
    return {
      valid: !!(payload && payload.ok),
      message: payload && payload.ok ? "License activated" : payload?.error || "Invalid license",
      reason: payload?.status || payload?.reason || null,
      session_id: payload?.session_id || null,
      user_name: brandName,
      expires_at: license.expires_at || null,
      activated_at: license.created_at || null,
      status: license.plan || license.status || null,
      license_id: payload?.license_id || null,
      online_count: payload?.online_count || 0,
      config,
      branding: normalizeBranding(config),
      operations: normalizeOperations(config),
      raw: payload || null,
      key,
    };
  }

  function normalizeBranding(config) {
    const social = config?.socialLinks || {};
    return {
      brandName: config?.brandName || "Lovable",
      brandText: config?.brandText || config?.brandName || "Lovable",
      logoUrl: config?.logoUrl || "",
      socialLinks: social,
      footerText: social.poweredBy || `${config?.brandText || config?.brandName || "Lovable"} â€¢ v${CURRENT_VERSION}`,
      badgeText: config?.badgeText || config?.badge || config?.badge_text || "",
    };
  }

  function normalizeOperations(config) {
    return {
      forceUpgrade: config?.forceUpgrade || {},
      maintenance: config?.maintenance || {},
    };
  }

  function compareVersions(left, right) {
    const a = String(left || "").split(".").map((item) => Number(item) || 0);
    const b = String(right || "").split(".").map((item) => Number(item) || 0);
    for (let index = 0; index < Math.max(a.length, b.length); index++) {
      const diff = (a[index] || 0) - (b[index] || 0);
      if (diff !== 0) return diff;
    }
    return 0;
  }

  function shouldBlockForUpgrade(operations) {
    const upgrade = operations?.forceUpgrade || {};
    if (!upgrade.enabled) return false;
    const minimum = upgrade.minimumSupportedVersion || upgrade.minSupportedVersion || "";
    if (!minimum) return String(upgrade.mode || "").toLowerCase() === "mandatory";
    return compareVersions(CURRENT_VERSION, minimum) < 0;
  }

  function shouldShowUpgrade(operations) {
    const upgrade = operations?.forceUpgrade || {};
    if (!upgrade.enabled) return false;
    const latest = upgrade.latestVersion || "";
    return shouldBlockForUpgrade(operations) || (latest && compareVersions(CURRENT_VERSION, latest) < 0);
  }

  function isMaintenanceActive(operations) {
    const maintenance = operations?.maintenance || {};
    if (!maintenance.enabled) return false;
    if (maintenance.services && maintenance.services.extension === false) return false;
    if (maintenance.emergency) return true;
    const now = Date.now();
    const starts = maintenance.startsAt ? new Date(maintenance.startsAt).getTime() : 0;
    const ends = maintenance.endsAt ? new Date(maintenance.endsAt).getTime() : 0;
    return (!starts || now >= starts) && (!ends || now <= ends);
  }

  function storageState(normalized) {
    const branding = normalized.branding || {};
    const operations = normalized.operations || {};
    return {
      eu_license_valid: normalized.valid,
      eu_license_key: normalized.key || "",
      eu_license_id: normalized.license_id || null,
      eu_session_id: normalized.session_id || null,
      eu_user_name: normalized.user_name || null,
      eu_expires_at: normalized.expires_at || null,
      eu_activated_at: normalized.activated_at || null,
      eu_license_status: normalized.status || null,
      eu_license_config: normalized.config || {},
      eu_branding: branding,
      eu_operations: operations,

      ql_license_valid: normalized.valid,
      ql_license_key: normalized.key || "",
      ql_license_id: normalized.license_id || null,
      ql_session_id: normalized.session_id || null,
      ql_user_name: normalized.user_name || null,
      ql_expires_at: normalized.expires_at || null,
      ql_activated_at: normalized.activated_at || null,
      ql_license_status: normalized.status || null,
      ql_license_config: normalized.config || {},
      ql_branding: branding,
      ql_operations: operations,
    };
  }

  function clearKeys() {
    return [
      "eu_license_valid",
      "eu_license_key",
      "eu_license_id",
      "eu_session_id",
      "eu_user_name",
      "eu_expires_at",
      "eu_activated_at",
      "eu_license_status",
      "eu_license_config",
      "eu_branding",
      "eu_operations",
      "ql_license_valid",
      "ql_license_key",
      "ql_license_id",
      "ql_session_id",
      "ql_user_name",
      "ql_expires_at",
      "ql_activated_at",
      "ql_license_status",
      "ql_license_config",
      "ql_branding",
      "ql_operations",
    ];
  }

  async function validateLicense(key, options) {
    const cleanKey = String(key || "").trim().toUpperCase();
    const deviceId = options?.deviceId || "";
    const isHeartbeat = !!options?.heartbeat;
    const url = isHeartbeat ? HEARTBEAT_API : VALIDATE_API;
    const requestBody = isHeartbeat
      ? { key: cleanKey, device_id: deviceId }
      : { key: cleanKey, device_id: deviceId, label: options?.email || "" };
    console.log("[EUBackend] >>> validateLicense", {
      licenseKey: cleanKey.slice(0, 4) + "****",
      deviceId: deviceId.slice(0, 8) + "****",
      heartbeat: isHeartbeat,
      url,
    });
    let response;
    let payload = {};
    try {
      response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      payload = await response.json().catch(() => ({}));
    } catch (error) {
      return normalizeValidation(
        { ok: false, error: "License server unreachable", reason: "network_error" },
        cleanKey,
      );
    }
    console.log("[EUBackend] <<< payload", { status: response.status, payload });

    const ok = !!(payload.valid || payload.ok);
    if (!ok) {
      return normalizeValidation(
        {
          ok: false,
          error: REASON_MESSAGES[payload.reason] || payload.reason || `HTTP ${response.status}`,
          reason: payload.reason || null,
        },
        cleanKey,
      );
    }

    const serverTime = normalizeServerTime(response.headers.get("Date")) || new Date().toISOString();
    if (isExpiredAtServerTime(payload.expires_at, serverTime)) {
      return normalizeValidation({ ok: false, error: "License expired", reason: "expired" }, cleanKey);
    }

    const result = normalizeValidation(
      {
        ok: true,
        server_time: serverTime,
        license: {
          expires_at: payload.expires_at || null,
          status: "active",
          plan: payload.plan || "active",
        },
        config: {},
        online_count: payload.devices_used || 0,
      },
      cleanKey,
    );
    console.log("[EUBackend] <<< resultado final", result);
    return result;
  }

  const REASON_MESSAGES = {
    not_found: "Chave de licença não encontrada",
    expired: "Licença expirada",
    canceled: "Licença cancelada",
    suspended: "Licença suspensa",
    device_blocked: "Este dispositivo foi bloqueado",
    device_limit: "Limite de dispositivos atingido (máx. 3)",
    device_not_registered: "Dispositivo não registrado — ative a licença novamente",
    invalid_request: "Dados de ativação inválidos",
    network_error: "Não foi possível contatar o servidor de licenças",
  };

  function normalizeServerTime(input) {
    const time = new Date(input || "").getTime();
    return Number.isFinite(time) ? new Date(time).toISOString() : null;
  }

  function isExpiredAtServerTime(expiresAt, serverTime) {
    if (!expiresAt) return false;
    const expiresMs = new Date(expiresAt).getTime();
    const serverMs = new Date(serverTime).getTime();
    return Number.isFinite(expiresMs) && Number.isFinite(serverMs) && serverMs >= expiresMs;
  }

  async function sha256Hex(input) {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(String(input)));
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  function base64UrlDecode(input) {
    const normalized = String(input || "").replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index++) bytes[index] = binary.charCodeAt(index);
    return bytes;
  }

  function pemToBytes(pem) {
    const b64 = String(pem || "")
      .replace(/-----BEGIN [^-]+-----/g, "")
      .replace(/-----END [^-]+-----/g, "")
      .replace(/\s+/g, "");
    return base64UrlDecode(b64.replace(/\+/g, "-").replace(/\//g, "_"));
  }

  async function improvePrompt(prompt, key) {
    const response = await fetch(`${API_BASE}/api/v1/ai/improve-prompt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-License-Key": key || "",
      },
      body: JSON.stringify({
        prompt,
        licenseKey: key || "",
      }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok && !payload.error) payload.error = `HTTP ${response.status}`;
    return {
      ...payload,
      optimized_prompt: payload.optimized_prompt || payload.text || "",
    };
  }

  async function uploadMedia(file, key) {
    const response = await fetch(`${API_BASE}/api/v1/media/upload`, {
      method: "POST",
      headers: {
        "Content-Type": file.type || "application/octet-stream",
        "X-License-Key": key || "",
        "X-File-Name": file.name || "attachment",
      },
      body: file,
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || `Upload failed: ${response.status}`);
    return {
      file_id: payload.id || payload.objectKey || payload.object_key || payload.public_url || payload.url,
      file_name: payload.originalName || payload.original_name || file.name || "file",
      public_url: payload.publicUrl || payload.public_url || payload.url,
      raw: payload,
    };
  }

  async function getNotifications() {
    const response = await fetch(`${API_BASE}/api/v1/notifications`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });
    const payload = await response.json().catch(() => []);
    if (!response.ok) throw new Error(payload.error || `Notifications failed: ${response.status}`);
    return Array.isArray(payload) ? payload : payload.notifications || [];
  }

  function applyBranding(root, branding) {
    if (!root || !branding) return;
    const brandText = branding.brandText || branding.brandName || "Lovable";
    root.querySelectorAll(".ql-brand-text,.sp-brand-text").forEach((item) => {
      item.textContent = brandText;
    });
    root.querySelectorAll(".ql-footer-version,.sp-footer-badge").forEach((item) => {
      item.textContent = branding.footerText || `${brandText} â€¢ v${CURRENT_VERSION}`;
    });
    if (branding.logoUrl) {
      root.querySelectorAll(".ql-brand-logo,.ql-title-logo,.sp-brand-logo").forEach((item) => {
        item.src = branding.logoUrl;
      });
    }
    const badgeText = branding.badgeText || branding.badge || branding.statusText || "";
    if (badgeText) {
      root.querySelectorAll(".ql-badge-pro-header, .sp-badge, .ql-status-badge, .sp-status-badge").forEach((item) => {
        item.textContent = badgeText.toUpperCase();
      });
    }

    // Dynamic social links rendering
    const social = branding.socialLinks || {};
    const config = {
      websiteUrl: social.websiteUrl || social.website || '',
      facebookUrl: social.facebookUrl || social.facebook || '',
      youtubeUrl: social.youtubeUrl || social.youtube || '',
      instagramUrl: social.instagramUrl || social.instagram || '',
      telegramUrl: social.telegramUrl || social.telegram || '',
      whatsappUrl: social.whatsappUrl || social.whatsapp || '',
      tiktokUrl: social.tiktokUrl || social.tiktok || '',
      redditUrl: social.redditUrl || social.reddit || '',
      linkedinUrl: social.linkedinUrl || social.linkedin || '',
      xUrl: social.xUrl || social.twitterUrl || social.x || social.twitter || '',
      items: Array.isArray(social.items) ? social.items : [],
    };

    const items = socialItemsFromConfig(config);
    root.querySelectorAll(".ql-social-links, .sp-social-links").forEach((container) => {
      container.innerHTML = '';
      const isSidepanel = container.classList.contains('sp-social-links');
      const itemClass = isSidepanel ? 'sp-social-link' : 'ql-social-link';
      for (const item of items) {
        if (!item.url) continue;
        const link = document.createElement('a');
        link.className = itemClass;
        link.href = item.url;
        link.target = '_blank';
        link.rel = 'noreferrer';
        link.title = item.label;
        if (item.iconUrl) {
          const img = document.createElement('img');
          img.src = item.iconUrl;
          img.alt = '';
          img.width = 11;
          img.height = 11;
          link.appendChild(img);
        } else {
          const span = document.createElement('span');
          span.textContent = socialFallback(item);
          span.setAttribute('aria-hidden', 'true');
          link.appendChild(span);
        }
        container.appendChild(link);
      }
      container.hidden = items.every((item) => !item.url);
    });
  }

  function socialItemsFromConfig(config) {
    const fromItems = Array.isArray(config.items) ? config.items : [];
    const legacy = [
      ['website', 'Website', config.websiteUrl],
      ['facebook', 'Facebook', config.facebookUrl],
      ['youtube', 'YouTube', config.youtubeUrl],
      ['instagram', 'Instagram', config.instagramUrl],
      ['whatsapp', 'WhatsApp', config.whatsappUrl],
      ['tiktok', 'TikTok', config.tiktokUrl],
      ['reddit', 'Reddit', config.redditUrl],
      ['linkedin', 'LinkedIn', config.linkedinUrl],
      ['x', 'X', config.xUrl],
      ['telegram', 'Telegram', config.telegramUrl],
    ].map(([platform, label, url]) => ({ platform, label, url: url || '', iconUrl: '' }));
    const byKey = new Map();
    for (const item of [...legacy, ...fromItems]) {
      const key = String(item.platform || item.label || 'custom').toLowerCase();
      byKey.set(key + ':' + String(item.url || item.href || ''), {
        platform: key,
        label: String(item.label || item.name || item.platform || 'Social'),
        url: String(item.url || item.href || ''),
        iconUrl: String(item.iconUrl || item.icon || ''),
      });
    }
    return [...byKey.values()];
  }

  function socialFallback(item) {
    const map = {
      website: 'W',
      facebook: 'fb',
      youtube: 'yt',
      instagram: 'in',
      whatsapp: 'wa',
      tiktok: 'tk',
      reddit: 'rd',
      linkedin: 'ln',
      x: 'X',
      telegram: 'tg',
    };
    return map[item.platform] || item.label.slice(0, 2);
  }


  function renderBlockPage(kind, operations) {
    const upgrade = operations?.forceUpgrade || {};
    const maintenance = operations?.maintenance || {};
    const isMaintenance = kind === "maintenance";
    const title = isMaintenance ? "Maintenance" : "Update Required";
    const message = isMaintenance
      ? maintenance.message || "We are performing scheduled maintenance. Please try again later."
      : upgrade.message || "A new version is available. Please update to continue.";
    const url = isMaintenance ? maintenance.landingPageUrl : upgrade.downloadUrl;
    const notes = !isMaintenance && upgrade.releaseNotes ? `<p style="white-space:pre-wrap;margin-top:10px">${escapeHtml(upgrade.releaseNotes)}</p>` : "";
    const action = url
      ? `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" style="display:inline-flex;margin-top:14px;padding:9px 13px;border-radius:8px;background:#8d3dff;color:#fff;text-decoration:none;font-weight:700">Open</a>`
      : "";
    return `<div class="ql-license-gate sp-license-gate" style="padding:34px 20px;text-align:center"><div class="ql-lock-icon" style="margin-bottom:12px">${isMaintenance ? "!" : "â†‘"}</div><h3 class="ql-gate-title">${title}</h3><p class="ql-gate-desc">${escapeHtml(message)}</p>${notes}${action}</div>`;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  window.EUBackend = {
    API_BASE,
    CURRENT_VERSION,
    getLicenseKey,
    validateLicense,
    improvePrompt,
    uploadMedia,
    getNotifications,
    storageState,
    clearKeys,
    normalizeValidation,
    normalizeBranding,
    normalizeOperations,
    shouldBlockForUpgrade,
    shouldShowUpgrade,
    isMaintenanceActive,
    applyBranding,
    renderBlockPage,
  };
})();

