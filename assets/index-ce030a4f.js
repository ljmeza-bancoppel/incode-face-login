(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))s(e);new MutationObserver(e=>{for(const n of e)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function r(e){const n={};return e.integrity&&(n.integrity=e.integrity),e.referrerPolicy&&(n.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?n.credentials="include":e.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(e){if(e.ep)return;e.ep=!0;const n=r(e);fetch(e.href,n)}})();let l;const c=document.getElementById("app"),d=document.getElementById("login"),f=document.getElementById("login-button");function a(t=null){c.innerHTML="Something Went Wrong, see console for details...",console.log(t)}function m(t){l.renderLogin(c,{onSuccess:async o=>{const{token:r,transactionId:s,interviewToken:e,faceMatch:n,customerId:i,email:u}=o;n?(console.log("token:",r),console.log("transactionId:",s),console.log("interviewToken:",e),console.log("faceMatch:",n),console.log("customerId:",i),console.log("email:",u)):a(new Error("Face did not match any user."))},onError:o=>{a(o)},isOneToOne:!0,oneToOneProps:{identityId:t}})}async function g(){const t={}.VITE_API_URL,o=atob({}.VITE_API_KEY);l=window.OnBoarding.create({apiURL:t,apiKey:o}),c.innerHTML="Warming up...",await l.warmup(),c.innerHTML="",d.style.display="flex",f.addEventListener("click",()=>{const r=document.getElementById("identity-id");d.style.display="none",m(r.value)})}document.addEventListener("DOMContentLoaded",g);
