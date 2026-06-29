import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Plus, Check, Flame, Layers, Activity, Trash2, ChevronRight, Syringe,
  Zap, TrendingUp, RotateCcw, Sparkles, AlertTriangle, Clock, RefreshCw, ShieldCheck,
  Calculator, Package, Share2, Copy, Download, Award, X, CheckCheck,
  MapPin, Lock, HeartPulse, Droplet, Plug, FlaskConical,
  BookOpen, ChevronLeft, Wand2, Stethoscope, ExternalLink, Building2, Camera, CalendarDays
} from "lucide-react";
import { supabase } from "./supabaseClient";

/* ============================================================================
   PEPTIDE OS — clean light wellness app.
   Tabs: Today · Stacks · Tools · Pairings · Insights
============================================================================ */
const CSS = `
.pos-root *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
.pos-root{
  --bg:#ffffff; --surface:#fbf9f4; --surface-2:#f3efe6;
  --ink:#20211e; --ink-2:#a39a88; --ink-3:#bdb4a3;
  --line:#eeeae0; --line-2:#eeeae0;
  --accent:#f0da88; --accent-soft:#fdf9f0; --accent-ink:#20211e;
  --amber:#a39a88; --amber-soft:#f3efe6; --red:#b5503e; --red-soft:#fdf0ef;
  --sans:-apple-system,BlinkMacSystemFont,"SF Pro Text","Inter",system-ui,sans-serif;
  font-family:var(--sans); color:var(--ink); background:var(--bg);
  position:relative; display:flex; flex-direction:column;
  height:790px; max-height:90vh; max-width:440px; margin:0 auto;
  border-radius:34px; overflow:hidden; -webkit-font-smoothing:antialiased; letter-spacing:-0.011em;
  box-shadow:0 30px 90px rgba(20,28,46,0.16);
}
@media (prefers-reduced-motion: reduce){ .pos-root *{transition:none!important;animation:none!important;} }
.pos-root .tnum{font-variant-numeric:tabular-nums;letter-spacing:-0.02em;}
.pos-scroll{flex:1;overflow-y:auto;overflow-x:hidden;padding:0 18px 130px;}
.pos-scroll::-webkit-scrollbar{width:0;}
.pos-eyebrow{font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink-3);}

.pos-head{padding:26px 4px 12px;display:flex;align-items:flex-start;justify-content:space-between;}
.pos-h-eyebrow{font-size:12px;font-weight:600;color:var(--ink-2);margin-bottom:5px;}
.pos-title{font-size:32px;font-weight:760;letter-spacing:-0.035em;line-height:0.95;}
.pos-head-actions{display:flex;gap:9px;}
.pos-iconbtn{width:38px;height:38px;border-radius:50%;border:1px solid var(--line-2);background:var(--surface);color:var(--ink);display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;transition:transform .12s,background .15s;box-shadow:0 1px 2px rgba(20,28,46,0.04);}
.pos-iconbtn:active{transform:scale(0.9);background:var(--surface-2);}

.pos-hero{position:relative;border-radius:24px;background:var(--surface);overflow:hidden;padding:26px 22px 16px;margin-bottom:18px;box-shadow:0 1px 2px rgba(20,28,46,0.04),0 8px 28px rgba(20,28,46,0.05);}
.pos-ringwrap{position:relative;width:184px;height:184px;margin:0 auto 4px;}
.pos-ring-center{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;}
.pos-ring-num{font-size:52px;font-weight:780;line-height:0.9;letter-spacing:-0.04em;}
.pos-ring-num small{font-size:25px;color:var(--ink-3);font-weight:700;}
.pos-ring-lbl{margin-top:9px;}
.pos-hero-stats{display:flex;border-top:1px solid var(--line);margin-top:16px;padding-top:15px;}
.pos-hstat{flex:1;text-align:center;position:relative;}
.pos-hstat+.pos-hstat::before{content:"";position:absolute;left:0;top:2px;bottom:2px;width:1px;background:var(--line);}
.pos-hstat-val{font-size:19px;font-weight:740;margin-top:6px;}
.pos-hstat-val .u{font-size:12px;color:var(--ink-3);font-weight:700;margin-left:1px;}

.pos-sec{display:flex;align-items:center;justify-content:space-between;padding:18px 6px 11px;}
.pos-sec-count{font-size:11px;font-weight:700;color:var(--ink-3);letter-spacing:0.04em;}
.pos-logall{font-size:12px;font-weight:700;color:var(--accent);background:var(--accent-soft);border:none;border-radius:9px;padding:6px 11px;cursor:pointer;display:flex;align-items:center;gap:5px;font-family:var(--sans);transition:transform .12s;}
.pos-logall:active{transform:scale(0.94);}

.pos-tl{position:relative;padding-left:4px;}
.pos-tl-rail{position:absolute;left:15px;top:6px;bottom:14px;width:2px;background:var(--line-2);}
.pos-tl-row{position:relative;display:flex;gap:15px;padding:6px 0;cursor:pointer;}
.pos-node{position:relative;z-index:2;width:32px;height:32px;border-radius:50%;flex-shrink:0;margin-top:11px;display:flex;align-items:center;justify-content:center;border:2px solid var(--line-2);background:var(--surface);transition:all .3s cubic-bezier(.34,1.56,.64,1);}
.pos-node .ck{transform:scale(0);transition:transform .25s cubic-bezier(.34,1.8,.64,1);color:#fff;}
.pos-node.done .ck{transform:scale(1);}
.pos-tl-card{flex:1;min-width:0;border-radius:16px;border:1px solid var(--line);background:var(--surface);padding:13px 15px;transition:border-color .25s,box-shadow .3s;box-shadow:0 1px 2px rgba(20,28,46,0.03);}
.pos-tl-row:active .pos-tl-card{background:var(--surface-2);}
.pos-tl-top{display:flex;align-items:baseline;justify-content:space-between;gap:8px;}
.pos-tl-name{font-size:16px;font-weight:680;letter-spacing:-0.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.pos-tl-time{font-size:13px;color:var(--ink-2);flex-shrink:0;}
.pos-tl-meta{display:flex;align-items:center;gap:8px;margin-top:5px;font-size:12.5px;color:var(--ink-2);flex-wrap:wrap;}
.pos-pill{display:inline-flex;align-items:center;gap:4px;font-size:10.5px;font-weight:800;letter-spacing:0.04em;text-transform:uppercase;padding:3px 8px;border-radius:7px;}
.pos-draw{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:800;padding:3px 8px;border-radius:7px;background:var(--accent-soft);color:var(--accent-ink);letter-spacing:0;}
.pos-now{display:flex;align-items:center;gap:10px;padding:5px 0 5px 47px;}
.pos-now-dot{width:6px;height:6px;border-radius:50%;background:var(--accent);flex-shrink:0;}
.pos-tl-site{display:flex;align-items:center;gap:6px;margin-top:10px;padding-top:10px;border-top:1px solid var(--line);font-size:12.5px;font-weight:680;color:var(--ink-2);cursor:pointer;}
.pos-tl-site:active{opacity:0.6;}
.pos-now-line{flex:1;height:1px;background:var(--line-2);}
.pos-now-lbl{font-size:10.5px;font-weight:700;letter-spacing:0.04em;color:var(--accent);}

.pos-pcard{position:relative;border-radius:20px;background:var(--surface);overflow:hidden;padding:16px 16px 14px;margin-bottom:13px;cursor:pointer;transition:transform .12s;box-shadow:0 1px 2px rgba(20,28,46,0.04),0 6px 22px rgba(20,28,46,0.05);}
.pos-pcard:active{transform:scale(0.985);}
.pos-pcard-strip{position:absolute;left:0;top:0;bottom:0;width:4px;}
.pos-pcard-top{display:flex;align-items:center;gap:12px;}
.pos-orb{width:38px;height:38px;border-radius:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.pos-pcard-name{font-size:18px;font-weight:740;letter-spacing:-0.025em;}
.pos-pcard-sched{font-size:12.5px;color:var(--ink-2);margin-top:1px;}
.pos-pcard-dose{font-size:14px;font-weight:700;color:var(--ink);text-align:right;}
.pos-pcard-dose .l{font-size:9.5px;color:var(--ink-3);font-weight:700;display:block;letter-spacing:0.08em;}
.pos-dots{display:flex;gap:4px;margin-top:13px;align-items:center;}
.pos-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0;}
.pos-supply{margin-top:12px;}
.pos-supply-top{display:flex;align-items:center;justify-content:space-between;font-size:11.5px;font-weight:600;margin-bottom:6px;}
.pos-bar{height:6px;border-radius:3px;background:var(--line-2);overflow:hidden;}
.pos-bar div{height:100%;border-radius:3px;transition:width .6s;}
.pos-cyclebar{height:5px;border-radius:3px;background:var(--line-2);overflow:hidden;margin-top:10px;}
.pos-cyclebar div{height:100%;border-radius:3px;transition:width .6s;}
.pos-pcard-foot{display:flex;align-items:center;justify-content:space-between;margin-top:13px;padding-top:12px;border-top:1px solid var(--line);}
.pos-foot-stat{display:flex;flex-direction:column;gap:3px;}
.pos-foot-stat .v{font-size:14px;font-weight:740;}

.pos-grid2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:13px;}
.pos-tile{border-radius:20px;background:var(--surface);padding:16px;box-shadow:0 1px 2px rgba(20,28,46,0.04),0 6px 20px rgba(20,28,46,0.05);}
.pos-tile-top{display:flex;align-items:center;gap:7px;}
.pos-tile-val{font-size:36px;font-weight:760;margin-top:10px;line-height:0.9;letter-spacing:-0.04em;}
.pos-tile-val .u{font-size:14px;color:var(--ink-3);font-weight:700;margin-left:3px;}
.pos-card{border-radius:20px;background:var(--surface);overflow:hidden;margin-bottom:13px;box-shadow:0 1px 2px rgba(20,28,46,0.04),0 6px 20px rgba(20,28,46,0.05);}
.pos-heat{display:flex;gap:4px;padding:18px 16px;overflow-x:auto;justify-content:center;}
.pos-heat-col{display:flex;flex-direction:column;gap:4px;}
.pos-heat-cell{width:13px;height:13px;border-radius:3.5px;}
.pos-barrow{padding:14px 16px;}
.pos-barrow+.pos-barrow{border-top:1px solid var(--line);}
.pos-bartop{display:flex;align-items:center;justify-content:space-between;margin-bottom:9px;}
.pos-barname{font-size:14.5px;font-weight:680;display:flex;align-items:center;gap:9px;}
.pos-bartrack{height:8px;border-radius:4px;background:var(--line-2);overflow:hidden;}
.pos-barfill{height:100%;border-radius:4px;transition:width .7s cubic-bezier(.4,0,.2,1);}

.pos-w-head{display:flex;align-items:flex-end;justify-content:space-between;padding:16px 16px 4px;}
.pos-w-val{font-size:32px;font-weight:780;letter-spacing:-0.04em;}
.pos-w-val .u{font-size:14px;color:var(--ink-3);font-weight:700;margin-left:2px;}
.pos-w-delta{font-size:13px;font-weight:700;display:flex;align-items:center;gap:4px;}
.pos-w-add{display:flex;gap:9px;padding:12px 16px 16px;align-items:center;}
.pos-w-input{flex:1;border:1px solid var(--line-2);background:var(--surface-2);border-radius:11px;padding:11px 13px;font-size:15px;font-family:var(--sans);color:var(--ink);outline:none;}
.pos-w-input:focus{border-color:var(--accent);}
.pos-w-btn{background:var(--accent);color:#fff;border:none;border-radius:11px;padding:0 16px;height:42px;font-size:14px;font-weight:740;cursor:pointer;font-family:var(--sans);}
.pos-unit{display:flex;background:var(--line);border-radius:9px;padding:2px;}
.pos-unit button{border:none;background:none;padding:8px 11px;font-size:12px;font-weight:700;border-radius:7px;color:var(--ink-2);cursor:pointer;font-family:var(--sans);}
.pos-unit button.active{background:var(--surface);color:var(--ink);box-shadow:0 1px 2px rgba(20,28,46,0.1);}

.pos-tool-card{border-radius:20px;background:var(--surface);padding:18px;margin-bottom:14px;box-shadow:0 1px 2px rgba(20,28,46,0.04),0 6px 20px rgba(20,28,46,0.05);}
.pos-tool-head{display:flex;align-items:center;gap:11px;margin-bottom:4px;}
.pos-tool-ic{width:40px;height:40px;border-radius:12px;background:var(--accent-soft);color:var(--accent);display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.pos-tool-t{font-size:17px;font-weight:760;letter-spacing:-0.02em;}
.pos-tool-s{font-size:12.5px;color:var(--ink-2);}
.pos-calc-row{display:flex;align-items:center;gap:12px;padding:12px 0;border-top:1px solid var(--line);}
.pos-calc-row:first-of-type{border-top:none;}
.pos-calc-row label{font-size:14.5px;flex:1;}
.pos-calc-input{width:96px;border:1px solid var(--line-2);background:var(--surface-2);border-radius:10px;padding:9px 11px;font-size:15px;text-align:right;font-family:var(--sans);color:var(--ink);outline:none;font-variant-numeric:tabular-nums;}
.pos-calc-input:focus{border-color:var(--accent);}
.pos-calc-result{margin-top:16px;border-radius:16px;background:var(--accent-soft);padding:18px;text-align:center;}
.pos-calc-big{font-size:38px;font-weight:800;letter-spacing:-0.04em;color:var(--accent-ink);}
.pos-calc-big .u{font-size:17px;font-weight:700;color:var(--accent);margin-left:4px;}
.pos-calc-sub{font-size:13px;color:var(--accent-ink);opacity:0.85;margin-top:4px;font-weight:600;}
.pos-syringe{margin-top:16px;}
.pos-syr-barrel{position:relative;height:34px;border:2px solid var(--line-2);border-radius:8px;background:var(--surface-2);overflow:hidden;}
.pos-syr-fill{position:absolute;left:0;top:0;bottom:0;background:linear-gradient(90deg,#f3efe6,#ecd9a0);transition:width .4s;}
.pos-syr-ticks{display:flex;justify-content:space-between;margin-top:5px;font-size:9.5px;color:var(--ink-3);font-variant-numeric:tabular-nums;}
.pos-note{display:flex;gap:8px;align-items:flex-start;font-size:12px;color:var(--ink-3);line-height:1.5;margin-top:14px;}
.pos-mini-tabs{display:flex;background:var(--line);border-radius:11px;padding:3px;margin-bottom:14px;}
.pos-mini-tabs button{flex:1;border:none;background:none;padding:9px 2px;font-size:12.5px;font-weight:600;border-radius:8px;color:var(--ink-2);cursor:pointer;font-family:var(--sans);transition:all .2s;}
.pos-mini-tabs button.active{background:var(--surface);color:var(--ink);font-weight:780;box-shadow:0 1px 3px rgba(20,28,46,0.1);}
.pos-backup-area{width:100%;height:120px;border:1px solid var(--line-2);border-radius:12px;background:var(--surface-2);padding:11px;font-family:ui-monospace,monospace;font-size:11px;color:var(--ink-2);resize:none;outline:none;margin-top:12px;}
.pos-btn-row{display:flex;gap:10px;margin-top:12px;}
.pos-btn{flex:1;border:1px solid var(--line-2);background:var(--surface);border-radius:12px;padding:12px;font-size:14px;font-weight:700;cursor:pointer;font-family:var(--sans);display:flex;align-items:center;justify-content:center;gap:7px;color:var(--ink);transition:transform .12s;}
.pos-btn:active{transform:scale(0.96);}
.pos-btn.primary{background:var(--accent);color:#fff;border-color:var(--accent);}

/* chips */
.pos-chips{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px;margin-bottom:14px;}
.pos-chips::-webkit-scrollbar{height:0;}
.pos-chip-btn{flex-shrink:0;border:1px solid var(--line-2);background:var(--surface);border-radius:11px;padding:8px 13px;font-size:13px;font-weight:700;cursor:pointer;font-family:var(--sans);display:flex;align-items:center;gap:7px;color:var(--ink-2);transition:all .15s;}
.pos-chip-btn.active{background:var(--ink);color:#fff;border-color:var(--ink);}

/* body map / sites */
.pos-site-suggest{background:var(--accent-soft);border-radius:13px;padding:12px 14px;margin-top:8px;}
.pos-site-name{display:flex;align-items:center;gap:8px;font-size:15px;font-weight:740;color:var(--accent-ink);margin-top:5px;}
.pos-site-list{margin-top:12px;}
.pos-site-row{display:flex;align-items:center;gap:11px;width:100%;background:none;border:none;padding:11px 4px;cursor:pointer;font-family:var(--sans);border-top:1px solid var(--line);}
.pos-site-row:first-child{border-top:none;}
.pos-site-row:active{background:var(--surface-2);}
.pos-site-dot{width:11px;height:11px;border-radius:50%;flex-shrink:0;}

/* energy */
.pos-energy{display:flex;gap:8px;}
.pos-energy-btn{flex:1;border:1px solid var(--line);background:var(--surface-2);border-radius:13px;padding:11px 4px 9px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:5px;transition:transform .12s,border-color .2s,background .2s;font-family:var(--sans);}
.pos-energy-btn:active{transform:scale(0.93);}
.pos-energy-btn.sel{border-color:var(--accent);background:var(--accent-soft);}
.pos-energy-emoji{font-size:21px;line-height:1;}
.pos-energy-lbl{font-size:10.5px;font-weight:700;color:var(--ink-2);}
.pos-energy-btn.sel .pos-energy-lbl{color:var(--accent-ink);}

/* insight + achievements */
.pos-insight{display:flex;gap:13px;align-items:center;border-radius:20px;padding:16px 18px;margin-bottom:14px;color:var(--ink);background:var(--surface-2);box-shadow:0 1px 2px rgba(20,28,46,0.04),0 4px 14px rgba(20,28,46,0.04);}
.pos-insight-ic{width:38px;height:38px;border-radius:11px;background:var(--surface);border:1px solid var(--line);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--accent);}
.pos-insight-text{font-size:14px;line-height:1.42;font-weight:600;}
.pos-insight-text .pos-eyebrow{display:block;margin-bottom:3px;}
.pos-ach-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin-bottom:13px;}
.pos-ach{border-radius:15px;background:var(--surface);padding:13px 6px 11px;text-align:center;box-shadow:0 1px 2px rgba(20,28,46,0.04),0 4px 14px rgba(20,28,46,0.04);opacity:0.55;}
.pos-ach.on{opacity:1;}
.pos-ach-emoji{font-size:24px;line-height:1;height:26px;display:flex;align-items:center;justify-content:center;}
.pos-ach-name{font-size:10px;font-weight:800;margin-top:7px;letter-spacing:-0.01em;line-height:1.1;}
.pos-ach-desc{font-size:8.5px;color:var(--ink-3);margin-top:3px;line-height:1.2;}

/* devices / recovery */
.pos-device{display:flex;align-items:center;gap:12px;padding:14px 16px;border-top:1px solid var(--line);}
.pos-device:first-child{border-top:none;}
.pos-device-ic{width:38px;height:38px;border-radius:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:18px;}
.pos-device-name{font-size:15px;font-weight:700;flex:1;}
.pos-device-btn{border:1px solid var(--line-2);background:var(--surface);border-radius:10px;padding:8px 14px;font-size:13px;font-weight:700;cursor:pointer;font-family:var(--sans);color:var(--accent);}
.pos-rec-grid{display:flex;padding:4px 8px 14px;}
.pos-rec-cell{flex:1;text-align:center;padding:6px;}
.pos-rec-cell .v{font-size:22px;font-weight:780;letter-spacing:-0.03em;}
.pos-rec-cell .l{font-size:10px;font-weight:700;color:var(--ink-3);text-transform:uppercase;letter-spacing:0.04em;margin-top:3px;}
.pos-rec-input{width:100%;border:1px solid var(--line-2);background:var(--surface-2);border-radius:10px;padding:9px;font-size:14px;text-align:center;font-family:var(--sans);color:var(--ink);outline:none;}

/* labs */
.pos-lab-form{padding:14px 16px;}
.pos-lab-grid{display:flex;gap:9px;margin-top:9px;}
.pos-lab-row{display:flex;align-items:center;gap:12px;padding:13px 16px;border-top:1px solid var(--line);}
.pos-lab-row:first-child{border-top:none;}
.pos-lab-name{font-size:14.5px;font-weight:700;flex:1;}
.pos-lab-name .d{font-size:11px;color:var(--ink-3);font-weight:600;}
.pos-lab-val{font-size:16px;font-weight:780;text-align:right;}
.pos-rng{font-size:9.5px;font-weight:800;padding:3px 7px;border-radius:6px;text-transform:uppercase;letter-spacing:0.03em;}

/* pairings */
.pos-ai-hero{border-radius:22px;padding:24px 20px;margin-bottom:16px;text-align:center;background:var(--surface-2);color:var(--ink);box-shadow:0 1px 2px rgba(20,28,46,0.04),0 4px 14px rgba(20,28,46,0.04);}
.pos-ai-hero h3{font-size:21px;font-weight:760;letter-spacing:-0.02em;margin:12px 0 6px;}
.pos-ai-hero p{font-size:13.5px;line-height:1.5;color:var(--ink-2);}
.pos-ai-ic{width:52px;height:52px;border-radius:16px;background:var(--surface);border:1px solid var(--line);display:flex;align-items:center;justify-content:center;margin:0 auto;color:var(--accent);}
.pos-ai-btn{margin-top:18px;width:100%;background:var(--ink);color:#fff;border:none;border-radius:14px;padding:14px;font-size:16px;font-weight:780;cursor:pointer;transition:transform .12s;font-family:var(--sans);display:flex;align-items:center;justify-content:center;gap:8px;}
.pos-ai-btn:active{transform:scale(0.97);}
.pos-ai-btn:disabled{opacity:0.7;cursor:default;}
.pos-stale{display:flex;align-items:center;gap:8px;background:var(--amber-soft);color:var(--amber);border-radius:12px;padding:10px 13px;font-size:12.5px;font-weight:600;margin-bottom:13px;}
.pos-sug{border-radius:16px;background:var(--surface);padding:15px 16px;margin-bottom:11px;box-shadow:0 1px 2px rgba(20,28,46,0.04),0 4px 16px rgba(20,28,46,0.04);}
.pos-sug-top{display:flex;align-items:center;justify-content:space-between;gap:10px;}
.pos-sug-name{font-size:16px;font-weight:740;letter-spacing:-0.02em;}
.pos-chip{font-size:10.5px;font-weight:700;letter-spacing:0.03em;padding:4px 9px;border-radius:8px;background:var(--accent-soft);color:var(--accent-ink);text-transform:uppercase;flex-shrink:0;}
.pos-sug-why{font-size:13.5px;color:var(--ink-2);line-height:1.5;margin-top:8px;}
.pos-sug-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:11px;}
.pos-sug-tag{display:inline-flex;align-items:center;gap:5px;font-size:12px;font-weight:600;color:var(--ink-2);background:var(--surface-2);border:1px solid var(--line);border-radius:8px;padding:5px 9px;}
.pos-caut{display:flex;gap:8px;align-items:flex-start;font-size:12.5px;color:var(--amber);background:var(--amber-soft);border-radius:10px;padding:9px 11px;margin-top:10px;line-height:1.45;}
.pos-watch{display:flex;gap:9px;padding:13px 16px;font-size:13.5px;color:var(--ink-2);line-height:1.5;}
.pos-watch+.pos-watch{border-top:1px solid var(--line);}
.pos-disc{font-size:12px;color:var(--ink-3);line-height:1.5;padding:14px 6px 0;display:flex;gap:8px;}
.pos-spin{width:22px;height:22px;border:2.5px solid rgba(255,255,255,0.4);border-top-color:#fff;border-radius:50%;animation:posspin .8s linear infinite;}
@keyframes posspin{to{transform:rotate(360deg);}}
.pos-skel{height:74px;border-radius:16px;background:linear-gradient(90deg,var(--surface) 25%,var(--surface-2) 50%,var(--surface) 75%);background-size:200% 100%;animation:posshim 1.3s infinite;margin-bottom:11px;box-shadow:0 1px 2px rgba(20,28,46,0.04);}
@keyframes posshim{to{background-position:-200% 0;}}

.pos-tabs{position:absolute;bottom:0;left:0;right:0;height:88px;padding:9px 0 22px;background:rgba(250,251,252,0.82);backdrop-filter:saturate(180%) blur(22px);-webkit-backdrop-filter:saturate(180%) blur(22px);border-top:1px solid var(--line);display:flex;}
.pos-tab{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;background:none;border:none;cursor:pointer;color:var(--ink-3);transition:color .15s;padding:6px 0;}
.pos-tab.active{color:var(--accent);}
.pos-tab-lbl{font-size:9.5px;font-weight:700;letter-spacing:0.01em;}

.pos-empty{text-align:center;padding:48px 28px;}
.pos-empty-ic{width:76px;height:76px;border-radius:22px;background:var(--surface);border:1px solid var(--line);display:flex;align-items:center;justify-content:center;margin:0 auto 18px;color:var(--ink-2);box-shadow:0 4px 16px rgba(20,28,46,0.05);}
.pos-empty-t{font-size:21px;font-weight:760;letter-spacing:-0.02em;}
.pos-empty-s{font-size:14.5px;color:var(--ink-2);margin-top:8px;line-height:1.5;}
.pos-cta{margin-top:22px;background:var(--accent);color:#fff;border:none;border-radius:14px;padding:14px 26px;font-size:16px;font-weight:760;cursor:pointer;transition:transform .12s,background .15s;font-family:var(--sans);}
.pos-cta:active{transform:scale(0.96);background:var(--accent-ink);}

.pos-confetti{position:absolute;inset:0;pointer-events:none;z-index:60;overflow:hidden;}
.pos-cpiece{position:absolute;top:-24px;width:9px;height:14px;border-radius:2px;animation:posfall linear forwards;}
@keyframes posfall{0%{transform:translateY(-24px) rotate(0);opacity:1;}100%{transform:translateY(840px) rotate(680deg);opacity:0;}}

.pos-share-ov{position:absolute;inset:0;z-index:70;background:rgba(20,28,46,0.45);display:flex;align-items:center;justify-content:center;padding:24px;opacity:0;transition:opacity .3s;}
.pos-share-ov.open{opacity:1;}
.pos-share-card{width:100%;max-width:330px;border-radius:26px;padding:30px 26px;color:var(--ink);background:var(--surface-2);border:1px solid var(--line);box-shadow:0 4px 14px rgba(20,28,46,0.04);transform:scale(0.92);transition:transform .35s cubic-bezier(.34,1.4,.64,1);}
.pos-share-ov.open .pos-share-card{transform:scale(1);}
.pos-share-brand{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:800;letter-spacing:0.02em;color:var(--ink-2);}
.pos-share-streak{font-size:78px;font-weight:850;letter-spacing:-0.05em;line-height:0.92;margin-top:18px;color:var(--ink);}
.pos-share-streak span{font-size:26px;font-weight:700;color:var(--ink-2);}
.pos-share-lbl{font-size:15px;font-weight:600;color:var(--ink-2);margin-top:2px;}
.pos-share-grid{display:flex;gap:14px;margin-top:24px;border-top:1px solid var(--line);padding-top:18px;}
.pos-share-stat{flex:1;}
.pos-share-stat .v{font-size:24px;font-weight:800;letter-spacing:-0.03em;color:var(--ink);}
.pos-share-stat .l{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--ink-2);margin-top:3px;}
.pos-share-hint{color:var(--ink-2);font-size:13px;font-weight:600;text-align:center;margin-top:16px;}
.pos-share-close{position:absolute;top:18px;right:18px;width:34px;height:34px;border-radius:50%;background:var(--line);border:none;color:var(--ink);display:flex;align-items:center;justify-content:center;cursor:pointer;}

.pos-ov{position:absolute;inset:0;background:rgba(20,28,46,0.32);z-index:50;opacity:0;transition:opacity .35s;}
.pos-ov.open{opacity:1;}
.pos-sheet{position:absolute;left:0;right:0;bottom:0;z-index:51;background:var(--bg);border-radius:26px 26px 0 0;max-height:93%;display:flex;flex-direction:column;transform:translateY(100%);transition:transform .42s cubic-bezier(.32,.72,0,1);}
.pos-sheet.open{transform:translateY(0);}
.pos-grab{width:38px;height:5px;border-radius:3px;background:var(--line-2);margin:9px auto 2px;flex-shrink:0;}
.pos-snav{display:flex;align-items:center;justify-content:space-between;padding:10px 18px 8px;}
.pos-snav button{background:none;border:none;color:var(--accent);font-size:16px;cursor:pointer;font-family:var(--sans);padding:6px 0;font-weight:600;}
.pos-snav .save{font-weight:780;}
.pos-snav .save:disabled{color:var(--ink-3);}
.pos-snav-t{font-size:16px;font-weight:760;}
.pos-sbody{overflow-y:auto;padding:10px 18px 36px;}
.pos-flbl{font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:var(--ink-3);padding:14px 6px 9px;}
.pos-field{background:var(--surface);border:1px solid var(--line);border-radius:15px;}
.pos-frow{display:flex;align-items:center;padding:13px 15px;gap:12px;}
.pos-frow+.pos-frow{border-top:1px solid var(--line);}
.pos-frow label{font-size:16px;width:88px;flex-shrink:0;font-weight:500;}
.pos-input{flex:1;border:none;background:none;font-size:16px;color:var(--ink);font-family:var(--sans);text-align:right;outline:none;min-width:0;}
.pos-input::placeholder{color:var(--ink-3);}
.pos-seg{display:flex;background:var(--line);border-radius:11px;padding:3px;}
.pos-seg button{flex:1;border:none;background:none;padding:9px 4px;font-size:13px;font-weight:600;border-radius:8px;cursor:pointer;color:var(--ink-2);font-family:var(--sans);transition:all .2s;}
.pos-seg button.active{background:var(--surface);color:var(--ink);font-weight:780;box-shadow:0 1px 3px rgba(20,28,46,0.1);}
.pos-days{display:flex;gap:7px;justify-content:space-between;}
.pos-day{width:38px;height:38px;border-radius:11px;border:1px solid var(--line-2);background:var(--surface);color:var(--ink-2);font-size:14px;font-weight:700;cursor:pointer;transition:transform .12s;font-family:var(--sans);}
.pos-day:active{transform:scale(0.9);}
.pos-step{display:flex;align-items:center;background:var(--line);border-radius:9px;}
.pos-step button{width:42px;height:34px;border:none;background:none;color:var(--accent);font-size:20px;cursor:pointer;}
.pos-step button:disabled{color:var(--ink-3);}
.pos-step span{font-size:16px;font-weight:780;min-width:26px;text-align:center;}
.pos-sw{padding:12px 14px;display:flex;gap:13px;flex-wrap:wrap;}
.pos-swatch{width:32px;height:32px;border-radius:50%;cursor:pointer;transition:transform .12s;position:relative;border:none;}
.pos-swatch:active{transform:scale(0.88);}
.pos-swatch.sel::after{content:"";position:absolute;inset:-4px;border-radius:50%;border:2.5px solid var(--ink);}
.pos-toggle{width:51px;height:31px;border-radius:16px;border:none;background:var(--line-2);cursor:pointer;position:relative;transition:background .25s;flex-shrink:0;}
.pos-toggle.on{background:var(--accent);}
.pos-toggle::after{content:"";position:absolute;width:27px;height:27px;border-radius:50%;background:#fff;top:2px;left:2px;transition:transform .25s cubic-bezier(.34,1.4,.64,1);box-shadow:0 1px 3px rgba(20,28,46,0.25);}
.pos-toggle.on::after{transform:translateX(20px);}
.pos-recon-prev{margin-top:12px;border-radius:13px;background:var(--accent-soft);padding:13px 15px;text-align:center;}
.pos-recon-prev .big{font-size:24px;font-weight:800;color:var(--accent-ink);letter-spacing:-0.03em;}
.pos-recon-prev .sub{font-size:12px;color:var(--accent-ink);opacity:0.85;margin-top:3px;font-weight:600;}
.pos-del{width:100%;background:var(--surface);border:1px solid var(--line);border-radius:15px;padding:14px;color:var(--red);font-size:16px;font-weight:700;cursor:pointer;margin-top:22px;font-family:var(--sans);}
.pos-del:active{background:var(--red-soft);}
.pos-hint{font-size:12.5px;color:var(--ink-3);padding:9px 6px 0;line-height:1.45;}

/* protocol library */
.pos-proto-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.pos-proto{text-align:left;border:1px solid var(--line);background:var(--surface);border-radius:18px;padding:16px;cursor:pointer;font-family:var(--sans);transition:transform .12s,box-shadow .2s;box-shadow:0 1px 2px rgba(20,28,46,0.04),0 5px 16px rgba(20,28,46,0.05);}
.pos-proto:active{transform:scale(0.97);}
.pos-proto-emoji{width:42px;height:42px;border-radius:13px;display:flex;align-items:center;justify-content:center;font-size:22px;}
.pos-proto-name{font-size:15.5px;font-weight:760;letter-spacing:-0.02em;margin-top:12px;}
.pos-proto-tag{font-size:11.5px;color:var(--ink-2);line-height:1.35;margin-top:4px;min-height:31px;}
.pos-proto-count{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.03em;margin-top:8px;}
.pos-proto-hero{display:flex;align-items:center;gap:15px;border-radius:20px;padding:20px;color:#fff;margin-top:6px;box-shadow:0 10px 28px rgba(20,28,46,0.16);}
.pos-proto-hero-emoji{width:54px;height:54px;border-radius:16px;background:rgba(255,255,255,0.2);display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0;}

/* clinic / white-label */
.pos-clinic-banner{display:flex;align-items:center;gap:12px;background:var(--accent-soft);border:1px solid color-mix(in srgb, var(--accent) 18%, transparent);border-radius:16px;padding:12px 14px;margin-bottom:14px;cursor:pointer;transition:transform .12s;}
.pos-clinic-banner:active{transform:scale(0.985);}
.pos-clinic-logo{width:40px;height:40px;border-radius:12px;background:#fff;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;}
.pos-clinic-name{font-size:15px;font-weight:780;letter-spacing:-0.02em;color:var(--accent-ink);}
.pos-clinic-sub{font-size:11.5px;color:var(--accent-ink);opacity:0.72;font-weight:600;margin-top:1px;}
.pos-clinic-card{display:flex;align-items:center;gap:13px;width:100%;border:1px solid var(--line);background:var(--surface);border-radius:16px;padding:14px;cursor:pointer;font-family:var(--sans);margin-bottom:11px;transition:transform .12s;box-shadow:0 1px 2px rgba(20,28,46,0.04),0 5px 16px rgba(20,28,46,0.05);}
.pos-clinic-card:active{transform:scale(0.98);}
.pos-proto-badge{font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:0.04em;margin-top:8px;}
.pos-mini-add{width:32px;height:32px;border-radius:9px;border:none;background:var(--accent);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;}
.pos-mini-add:active{opacity:0.8;}
.pos-prov-hero{border-radius:20px;padding:20px;color:#fff;margin-top:4px;box-shadow:0 10px 28px rgba(20,28,46,0.16);}
.pos-patient{display:flex;align-items:center;gap:12px;width:100%;border:none;border-top:1px solid var(--line);background:none;padding:13px 4px;cursor:pointer;font-family:var(--sans);}
.pos-patient:first-of-type{border-top:none;}
.pos-patient:active{opacity:0.6;}
.pos-avatar{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0;letter-spacing:0.02em;}
.pos-journey-link{display:flex;align-items:center;justify-content:center;gap:5px;width:100%;margin-top:11px;padding-top:12px;border:none;border-top:1px solid var(--line);background:none;color:var(--accent);font-size:12.5px;font-weight:740;cursor:pointer;font-family:var(--sans);}
.pos-journey-link:active{opacity:0.6;}
.pos-jrny{margin-top:2px;}
.pos-jrny-row{display:flex;gap:13px;}
.pos-jrny-rail{display:flex;flex-direction:column;align-items:center;flex-shrink:0;width:18px;}
.pos-jrny-dot{width:14px;height:14px;border-radius:50%;border:2px solid var(--line-2);background:var(--surface);margin-top:3px;flex-shrink:0;transition:all .3s;}
.pos-jrny-line{flex:1;width:2px;background:var(--line-2);margin:3px 0;min-height:14px;}
.pos-jrny-body{flex:1;min-width:0;padding-bottom:18px;}
.pos-jrny-top{display:flex;align-items:center;gap:8px;}
.pos-jrny-label{font-size:11px;font-weight:800;letter-spacing:0.05em;text-transform:uppercase;color:var(--ink-3);}
.pos-jrny-title{font-size:16px;font-weight:740;letter-spacing:-0.02em;margin-top:3px;}
.pos-jrny-text{font-size:13.5px;color:var(--ink-2);line-height:1.5;margin-top:4px;}
.pos-jrny-row.active .pos-jrny-body{}
.pos-dots-lbl{display:flex;align-items:center;justify-content:space-between;margin:14px 0 9px;}
.pos-week{display:flex;justify-content:space-between;gap:4px;}
.pos-wday{display:flex;flex-direction:column;align-items:center;gap:6px;flex:1;}
.pos-wdot{width:27px;height:27px;border-radius:50%;display:flex;align-items:center;justify-content:center;transition:background .2s;}
.pos-wdot.today{box-shadow:0 0 0 2px var(--surface),0 0 0 3.5px var(--ink-3);}
.pos-wlbl{font-size:10px;font-weight:800;color:var(--ink-3);letter-spacing:0.02em;}
.pos-card-actions{display:flex;gap:0;margin-top:13px;border-top:1px solid var(--line);}
.pos-card-act{flex:1;display:flex;align-items:center;justify-content:center;gap:5px;padding:12px 6px 2px;border:none;background:none;color:var(--accent);font-size:12.5px;font-weight:740;cursor:pointer;font-family:var(--sans);}
.pos-card-act:first-child{border-right:1px solid var(--line);}
.pos-card-act:active{opacity:0.6;}
.pos-cal-nav{display:flex;align-items:center;justify-content:space-between;margin:2px 4px 12px;}
.pos-cal-nav>span{font-size:16px;font-weight:780;letter-spacing:-0.01em;}
.pos-cal-nav>button{width:38px;height:38px;border-radius:11px;border:1px solid var(--line-2);background:var(--surface);color:var(--ink);display:flex;align-items:center;justify-content:center;cursor:pointer;}
.pos-cal-nav>button:disabled{opacity:0.35;cursor:default;}
.pos-cal-dow{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;margin-bottom:6px;}
.pos-cal-dow>span{text-align:center;font-size:10.5px;font-weight:800;color:var(--ink-3);}
.pos-cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:6px;}
.pos-cal-day{aspect-ratio:1;border-radius:11px;border:1px solid var(--line);background:var(--surface);color:var(--ink-2);font-size:14px;font-weight:680;cursor:pointer;display:flex;align-items:center;justify-content:center;font-family:var(--sans);font-variant-numeric:tabular-nums;}
.pos-cal-day:active{transform:scale(0.94);}
.pos-cal-day.taken{color:#fff;font-weight:800;}
.pos-cal-day.today{border-color:var(--ink-3);border-width:2px;}
.pos-cal-day:disabled{opacity:0.3;cursor:default;}
.pos-cal-foot{text-align:center;font-size:12.5px;color:var(--ink-3);font-weight:640;margin-top:14px;}
.pos-row-btn{display:flex;align-items:center;justify-content:space-between;width:100%;padding:15px 16px;border:none;background:none;color:var(--ink);font-size:15.5px;font-weight:600;cursor:pointer;font-family:var(--sans);}
.pos-row-btn:active{background:var(--surface-2);}
.pos-card-x{flex-shrink:0;align-self:center;width:24px;height:24px;border-radius:50%;border:none;background:var(--surface-2);color:var(--ink-3);display:flex;align-items:center;justify-content:center;cursor:pointer;margin-left:2px;}
.pos-card-x:active{background:var(--line);color:var(--ink);}
.pos-scan-btn{display:flex;align-items:center;justify-content:center;gap:9px;width:100%;padding:14px;border:1px solid var(--accent);background:var(--accent-soft);color:var(--accent-ink);border-radius:14px;font-size:15px;font-weight:760;cursor:pointer;font-family:var(--sans);margin-bottom:10px;}
.pos-scan-btn:active{transform:scale(0.99);}
.pos-scan-btn:disabled{opacity:0.7;cursor:default;}
.pos-scan-spin{width:16px;height:16px;border-radius:50%;border:2px solid var(--accent-soft);border-top-color:var(--accent);animation:posspin 0.7s linear infinite;}
@keyframes posspin{to{transform:rotate(360deg);}}
.pos-scan-msg{display:flex;align-items:flex-start;gap:8px;font-size:12.5px;font-weight:600;line-height:1.45;padding:11px 13px;border-radius:12px;margin-bottom:12px;}
.pos-scan-hint{font-size:11.5px;color:var(--ink-3);line-height:1.45;margin:-2px 2px 14px;}
`;

/* ---------- data ---------- */
const PALETTE = [
  { name:"teal",   hex:"#1c8a74" }, { name:"blue",   hex:"#4f7cc4" },
  { name:"violet", hex:"#8a6fd1" }, { name:"green",  hex:"#4fa76b" },
  { name:"copper", hex:"#c77d4a" }, { name:"coral",  hex:"#dd7a5e" },
  { name:"rose",   hex:"#d26a88" }, { name:"slate",  hex:"#64748b" },
  { name:"gold",   hex:"#c9a23f" }, { name:"indigo", hex:"#6366cf" },
];
const SUGGESTIONS = ["BPC-157","TB-500","Ipamorelin","CJC-1295","Tesamorelin","Sermorelin","GHK-Cu","MOTS-c","Semaglutide","Tirzepatide","Retatrutide","Selank","Semax","Epitalon","Thymosin Alpha-1","AOD-9604","PT-141","Melanotan II","NAD+","Glutathione"];
const LAB_MARKERS = ["IGF-1","Total Testosterone","Free Testosterone","Estradiol (E2)","SHBG","HbA1c","Fasting Glucose","Fasting Insulin","hs-CRP","ALT","AST","HDL","LDL","Triglycerides","TSH","Free T3","Free T4","Cortisol","Vitamin D","Ferritin","Prolactin","Hematocrit"];
const DOW = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const DOW1 = ["S","M","T","W","T","F","S"];
const CONFETTI_COLORS = ["#ecd9a0","#f0da88","#f3efe6","#20211e","#a39a88","#bdb4a3","#2f5d5a","#4f7d5f"];
const SITES=[
  {id:"abL",name:"Abdomen · Left",short:"L abdomen",x:38,y:120},{id:"abR",name:"Abdomen · Right",short:"R abdomen",x:62,y:120},
  {id:"lhL",name:"Love handle · Left",short:"L flank",x:24,y:132},{id:"lhR",name:"Love handle · Right",short:"R flank",x:76,y:132},
  {id:"glL",name:"Upper glute · Left",short:"L glute",x:38,y:146},{id:"glR",name:"Upper glute · Right",short:"R glute",x:62,y:146},
  {id:"thL",name:"Thigh · Left",short:"L thigh",x:40,y:188},{id:"thR",name:"Thigh · Right",short:"R thigh",x:60,y:188},
  {id:"armL",name:"Upper arm · Left",short:"L arm",x:18,y:88},{id:"armR",name:"Upper arm · Right",short:"R arm",x:82,y:88},
];
const siteShort=(id)=>SITES.find(s=>s.id===id)?.short||"";
const DEVICES=[
  {id:"oura",name:"Oura Ring",emoji:"💍",bg:"#1b1e25"},
  {id:"apple",name:"Apple Health",emoji:"❤️",bg:"#fde7ea"},
  {id:"whoop",name:"WHOOP",emoji:"⚡️",bg:"#eef2f6"},
  {id:"eight",name:"Eight Sleep",emoji:"🛏️",bg:"#eef2f6"},
];
const PROTOCOLS=[
  {id:"recovery",emoji:"🛠️",name:"Recovery & Repair",tag:"Soft-tissue, tendon & joint recovery",accent:"#c77d4a",
   peptides:[{name:"BPC-157",color:"#c77d4a",time:"08:00",schedule:{type:"daily"}},{name:"TB-500",color:"#c9a23f",time:"08:00",schedule:{type:"weekly",days:[1,4]}}]},
  {id:"glp1",emoji:"📉",name:"GLP-1 Weekly",tag:"Once-weekly GLP-1 cadence",accent:"#4f7cc4",
   peptides:[{name:"Retatrutide",color:"#4f7cc4",time:"20:00",schedule:{type:"weekly",days:[0]}}]},
  {id:"gh",emoji:"💪",name:"GH Support",tag:"Evening growth-hormone-axis stack",accent:"#4fa76b",
   peptides:[{name:"CJC-1295",color:"#4fa76b",time:"22:00",schedule:{type:"daily"}},{name:"Ipamorelin",color:"#5cb89e",time:"22:00",schedule:{type:"daily"}}]},
  {id:"longevity",emoji:"⏳",name:"Longevity",tag:"Cellular & systemic support",accent:"#8a6fd1",
   peptides:[{name:"NAD+",color:"#8a6fd1",time:"07:30",schedule:{type:"everyN",n:2}},{name:"GHK-Cu",color:"#c77d4a",time:"20:00",schedule:{type:"daily"}},{name:"Epitalon",color:"#6366cf",time:"21:00",schedule:{type:"weekly",days:[1,2,3,4,5]}}]},
  {id:"cognitive",emoji:"🧠",name:"Focus & Calm",tag:"Daytime cognitive support",accent:"#6366cf",
   peptides:[{name:"Semax",color:"#6366cf",time:"09:00",schedule:{type:"daily"}},{name:"Selank",color:"#4f7cc4",time:"14:00",schedule:{type:"daily"}}]},
  {id:"glow",emoji:"✨",name:"Skin & Hair",tag:"Collagen, tone & antioxidant",accent:"#d26a88",
   peptides:[{name:"GHK-Cu",color:"#c77d4a",time:"20:00",schedule:{type:"daily"}},{name:"Glutathione",color:"#4fa76b",time:"07:30",schedule:{type:"weekly",days:[1,2,3,4,5]}}]},
];
/* White-label clinic editions. A clinic loads its brand, catalog (with reconstitution
   specs) and protocols; the patient app re-skins to match. Doses stay provider-set. */
const CLINICS=[
  {id:"everage",name:"EverAge Longevity",tagline:"Your protocol, beautifully managed",emoji:"🧬",
   accent:"#216b86",accentSoft:"#e7f1f5",accentInk:"#114b61",storeUrl:"https://everagelongevity.com",
   catalog:[
     {name:"Retatrutide",color:"#216b86",time:"20:00",schedule:{type:"weekly",days:[0]},recon:{mode:"units",units:0},blurb:"GLP-1 / GIP / glucagon · pre-mixed"},
     {name:"Tirzepatide",color:"#2f7d9a",time:"20:00",schedule:{type:"weekly",days:[0]},recon:{mode:"units",units:0},blurb:"GLP-1 / GIP dual agonist · pre-mixed"},
     {name:"BPC-157",color:"#c77d4a",time:"08:00",schedule:{type:"daily"},recon:{mode:"units",units:0},blurb:"Recovery & gut support · pre-mixed"},
     {name:"TB-500",color:"#c9a23f",time:"08:00",schedule:{type:"weekly",days:[1,4]},recon:{mode:"units",units:0},blurb:"Tissue repair · pre-mixed"},
     {name:"GHK-Cu",color:"#4fa76b",time:"20:00",schedule:{type:"daily"},recon:{mode:"units",units:0},blurb:"Skin, hair & collagen · pre-mixed"},
     {name:"NAD+",color:"#8a6fd1",time:"07:30",schedule:{type:"everyN",n:2},recon:{mode:"units",units:0},blurb:"Cellular energy · 100 mg/mL pre-mixed"},
     {name:"Ipamorelin",color:"#5cb89e",time:"22:00",schedule:{type:"daily"},recon:{mode:"units",units:0},blurb:"GH secretagogue · pre-mixed"},
     {name:"Glutathione",color:"#4f7cc4",time:"07:30",schedule:{type:"weekly",days:[1,2,3,4,5]},recon:{mode:"units",units:0},blurb:"Master antioxidant · pre-mixed"},
   ],
   protocols:[
     {id:"ev_lean",emoji:"📉",name:"EverAge Lean",tag:"Weekly GLP-1 + recovery",accent:"#216b86",peptides:[{name:"Retatrutide",color:"#216b86",time:"20:00",schedule:{type:"weekly",days:[0]}},{name:"BPC-157",color:"#c77d4a",time:"08:00",schedule:{type:"daily"}}]},
     {id:"ev_long",emoji:"🧬",name:"EverAge Longevity",tag:"Signature cellular protocol",accent:"#2f7d9a",peptides:[{name:"NAD+",color:"#8a6fd1",time:"07:30",schedule:{type:"everyN",n:2}},{name:"GHK-Cu",color:"#4fa76b",time:"20:00",schedule:{type:"daily"}},{name:"Glutathione",color:"#4f7cc4",time:"07:30",schedule:{type:"weekly",days:[1,2,3,4,5]}}]},
   ]},
];
/* Demo roster for the provider dashboard preview (the real user is added live). */
const PATIENTS=[
  {name:"Marcus Thorne",init:"MT",proto:"GH Support",adh:0.96,streak:24,last:"6h ago",per:[{name:"CJC-1295",color:"#4fa76b",pct:0.97},{name:"Ipamorelin",color:"#5cb89e",pct:0.95}]},
  {name:"Elena Vasquez",init:"EV",proto:"Longevity",adh:0.91,streak:14,last:"1d ago",per:[{name:"NAD+",color:"#8a6fd1",pct:0.90},{name:"GHK-Cu",color:"#c77d4a",pct:0.93}]},
  {name:"Priya Sharma",init:"PS",proto:"GLP-1 Weekly",adh:0.74,streak:2,last:"3d ago",per:[{name:"Retatrutide",color:"#216b86",pct:0.74}]},
  {name:"Tom Becker",init:"TB",proto:"Recovery",adh:0.52,streak:0,last:"8d ago",per:[{name:"BPC-157",color:"#c77d4a",pct:0.61},{name:"TB-500",color:"#c9a23f",pct:0.43}]},
  {name:"Aisha Cole",init:"AC",proto:"Skin & Hair",adh:0.38,streak:0,last:"12d ago",per:[{name:"GHK-Cu",color:"#c77d4a",pct:0.40},{name:"Glutathione",color:"#4fa76b",pct:0.36}]},
];
function patientStatus(adh){return adh>=0.85?{label:"On track",color:"var(--accent)",bg:"var(--accent-soft)"}:adh>=0.6?{label:"Slipping",color:"var(--amber)",bg:"var(--amber-soft)"}:{label:"At risk",color:"var(--red)",bg:"var(--red-soft)"};}
/* Educational, process-based journey — what to focus on at each stage. Not medical advice. */
const JOURNEY=[
  {s:1,e:1,label:"Week 1",title:"Getting started",body:"Lock in a consistent injection time and rotate sites. Log a baseline — weight, energy, and any recent labs. Early on, consistency matters more than results."},
  {s:2,e:4,label:"Weeks 2–4",title:"Settling in",body:"The routine becomes habit. Note how you feel and jot any side effects so you can bring specifics to your provider rather than guessing later."},
  {s:5,e:8,label:"Weeks 4–8",title:"Building",body:"A common window to check in with your clinic and, if they advise it, repeat bloodwork. Read your trends over weeks, not day to day."},
  {s:9,e:12,label:"Weeks 8–12",title:"Review point",body:"Many protocols are reassessed around here — continue, adjust, or cycle off. Decide with your provider using your logged data and labs."},
  {s:13,e:Infinity,label:"12+ weeks",title:"Maintain or cycle",body:"If your protocol cycles, plan the off-period and keep logging through it. If ongoing, periodic labs and check-ins keep it on track."},
];
/* Short, general, commonly-discussed notes — educational only, never dosing guidance. */
const PEPTIDE_NOTES={
  "retatrutide":"GLP-1–class compound. Commonly started low and titrated up over weeks under medical supervision; appetite and GI changes are frequently discussed early. Any dose change is a clinician decision.",
  "tirzepatide":"GLP-1/GIP–class compound. Typically titrated gradually by a provider; early GI effects are commonly reported. Dose changes are clinician-led.",
  "semaglutide":"GLP-1–class compound. Usually titrated slowly under medical supervision; appetite and GI changes are commonly discussed in the first weeks.",
  "bpc-157":"Commonly discussed for recovery support and often run in focused cycles rather than indefinitely.",
  "tb-500":"Frequently paired with BPC-157 for recovery; people commonly discuss multi-week cycles.",
  "ghk-cu":"Commonly discussed for skin, hair and collagen; effects are typically described as gradual over weeks.",
  "nad+":"Commonly discussed for cellular energy; injections are sometimes noted to feel intense if pushed quickly — many go slow.",
  "ipamorelin":"A GH secretagogue commonly timed at night; usually discussed alongside cycle on/off periods.",
  "cjc-1295":"Often paired with ipamorelin for the GH axis; commonly discussed with evening timing.",
  "glutathione":"Commonly discussed as an antioxidant; often run on weekdays with weekends off.",
  "sermorelin":"A GH secretagogue commonly discussed with nightly timing and periodic breaks.",
  "epitalon":"Commonly discussed in short, defined cycles rather than continuous use.",
  "semax":"Commonly discussed for focus; typically used during the day.",
  "selank":"Commonly discussed for calm/anxiety support; often used during the day.",
};
function journeyWeek(p,now){const dd=dayDiff(now,parseKey(p.startDate));if(dd<0)return 0;return Math.floor(dd/7)+1;}
/* Per-peptide "what to expect" — general education from mechanism, clinical data where it exists, and commonly-reported user experience. Evidence level is flagged honestly. Never dosing or medical advice. */
const EV={trial:{label:"Backed by clinical trials",lvl:3},human:{label:"Some human studies",lvl:2},early:{label:"Mostly preclinical / anecdotal",lvl:1}};
const EXPECT={
  "retatrutide":{ev:"trial",over:"Investigational triple agonist (GLP-1 + GIP + glucagon) — the most effective weight-loss agent tested in trials so far. Not yet FDA-approved; dosing is started low and raised by a clinician.",phases:[
    {s:1,e:4,label:"Weeks 1–4",title:"Slow on purpose",body:"You start at a low dose that’s stepped up over time to limit nausea. Appetite may dip a little; early weight change is small by design — don’t judge results yet."},
    {s:5,e:12,label:"Weeks 4–12",title:"Appetite shifts",body:"Appetite suppression usually builds here. In trials, weight loss through ~12 weeks was still modest (roughly 8–10% at the highest dose) because the dose is still ramping."},
    {s:13,e:24,label:"Weeks 12–24",title:"It accelerates",body:"After reaching the maintenance dose, loss speeds up — about 17% of body weight by 24 weeks at the top dose in the phase-2 trial."},
    {s:25,e:999,label:"6 months +",title:"Keeps going",body:"Trials kept trending down with no plateau — ~24% at 48 weeks (phase 2) and ~29% at 68 weeks (phase 3). GI side effects mostly happen during the early dose-escalation window."}],
    note:"Nausea, fullness, and bowel changes are common early and usually ease at a steady dose. Any dose change is a clinician’s call."},
  "tirzepatide":{ev:"trial",over:"GLP-1 + GIP dual agonist (Mounjaro / Zepbound) with strong trial data for weight and blood sugar. Started low and titrated up monthly.",phases:[
    {s:1,e:4,label:"Weeks 1–4",title:"Easing in",body:"Low starting dose; appetite begins to drop. Mild nausea or fullness is common in the first weeks."},
    {s:5,e:12,label:"Weeks 4–12",title:"Steady loss",body:"As the dose steps up, appetite suppression and weight loss build week over week."},
    {s:13,e:36,label:"Months 3–9",title:"Building",body:"Continued loss toward the trial averages (~15–21% over ~72 weeks depending on dose)."},
    {s:37,e:999,label:"Longer term",title:"Maintenance",body:"Loss levels off near your effective dose; the focus shifts to holding the result with diet and muscle."}],
    note:"GI effects are most common while titrating. Dose changes are clinician-led."},
  "semaglutide":{ev:"trial",over:"GLP-1 agonist (Ozempic / Wegovy). Well-studied for appetite and weight; titrated slowly under medical supervision.",phases:[
    {s:1,e:4,label:"Weeks 1–4",title:"Easing in",body:"Low start; appetite begins to soften. Early nausea/fullness is common."},
    {s:5,e:16,label:"Weeks 4–16",title:"Finding the dose",body:"Dose steps up every few weeks; appetite suppression and weight loss build."},
    {s:17,e:999,label:"4 months +",title:"Toward the plateau",body:"Trial average was ~15% of body weight by 68 weeks; loss slows as you near your dose."}],
    note:"GI effects early are normal and usually ease. Clinician sets the schedule."},
  "ghk-cu":{ev:"human",over:"A natural copper tripeptide that declines with age, studied for skin remodeling, wound healing, and hair. Injected subcutaneously it works system-wide — effects are structural and gradual, not overnight.",phases:[
    {s:1,e:2,label:"Weeks 1–2",title:"Under the surface",body:"Usually little visible change yet. Some people notice skin feels smoother or more hydrated. Rotate injection sites and let the rebuild begin."},
    {s:3,e:6,label:"Weeks 3–6",title:"First visible changes",body:"This is when most people first see surface improvements — texture, tone, and hydration."},
    {s:7,e:12,label:"Weeks 6–12",title:"Collagen remodeling",body:"Firmness, fine lines, and skin density tend to change in this window; studies have measured meaningful collagen gains by around 12 weeks."},
    {s:13,e:999,label:"3 months +",title:"Hair & continued skin",body:"Hair follicle cycles run 8–12 weeks, so hair changes need 3+ months before a fair before/after. Skin keeps remodeling with consistent use."}],
    note:"GHK-Cu’s collagen and repair effects are well documented in lab and skin research; longevity clinics use the injectable (subcutaneous) form for system-wide effects. Trial data specific to the injected route is limited, so individual response varies."},
  "bpc-157":{ev:"early",over:"A synthetic peptide based on a protein found in the stomach, popular for soft-tissue and gut recovery. Almost all evidence is animal/lab work — there are no large human trials — so expectations come mostly from user reports.",phases:[
    {s:1,e:2,label:"Weeks 1–2",title:"Early days",body:"Some users report gut comfort fairly quickly; recovery effects are gradual."},
    {s:3,e:6,label:"Weeks 2–6",title:"Recovery reports",body:"Anecdotally, people describe reduced nagging pain and quicker recovery in tendons, joints, or the gut. Usually run as a focused cycle."},
    {s:7,e:999,label:"6 weeks +",title:"Cycle then reassess",body:"Most run multi-week cycles and then pause rather than using it indefinitely."}],
    note:"Human evidence is limited and it isn’t FDA-approved; treat reported benefits as anecdotal and discuss with a clinician."},
  "tb-500":{ev:"early",over:"A synthetic fragment related to thymosin beta-4, discussed for tissue repair and flexibility and often paired with BPC-157. Evidence is largely preclinical/anecdotal.",phases:[
    {s:1,e:4,label:"Weeks 1–4",title:"Loading phase",body:"Often front-loaded over the first weeks; recovery effects build slowly."},
    {s:5,e:999,label:"1 month +",title:"Maintenance / cycle",body:"Users typically shift to less frequent dosing and run defined cycles."}],
    note:"No solid human trials; reports are anecdotal. Discuss with a clinician."},
  "nad+":{ev:"human",over:"A coenzyme central to cellular energy and repair that declines with age. NAD biology is well studied; the benefit of NAD+ injections specifically is still mostly anecdotal.",phases:[
    {s:1,e:2,label:"Weeks 1–2",title:"Go slow",body:"Injections can feel intense — flushing, nausea, or chest tightness — if pushed too fast. Most people go slow. Some report an energy or clarity bump soon after."},
    {s:3,e:6,label:"Weeks 2–6",title:"Settling in",body:"Some users describe steadier energy, focus, or sleep over a few weeks. Effects are subtle and vary widely."},
    {s:7,e:999,label:"6 weeks +",title:"Ongoing",body:"Often used on an ongoing or cyclical basis for maintenance."}],
    note:"The discomfort during injection is dose/speed related — slower is more comfortable. Benefits of injectable NAD+ aren’t well established in trials."},
  "ipamorelin":{ev:"human",over:"A selective growth-hormone secretagogue that prompts a natural GH pulse with little effect on cortisol or hunger. Commonly used at night.",phases:[
    {s:1,e:2,label:"Weeks 1–2",title:"Sleep first",body:"The earliest thing many notice is deeper sleep and vivid dreams; a brief flush after injecting is common."},
    {s:3,e:8,label:"Weeks 2–8",title:"Recovery",body:"Recovery and sleep quality are the usual early wins. Body-composition changes are slow."},
    {s:9,e:999,label:"2 months +",title:"Gradual",body:"Subtle leaning and recovery over months; usually run in on/off cycles."}],
    note:"Growth-hormone effects are gradual and cycle-based. Use clinician guidance."},
  "cjc-1295":{ev:"human",over:"A GHRH analog that raises baseline growth hormone and IGF-1, often paired with ipamorelin. Effects build over weeks.",phases:[
    {s:1,e:2,label:"Weeks 1–2",title:"Sleep & recovery",body:"Like other GH peptides, sleep and recovery changes show up first."},
    {s:3,e:12,label:"Weeks 3–12",title:"IGF-1 rises",body:"IGF-1 climbs over weeks; recovery and body-composition shifts are gradual."}],
    note:"GH-axis effects are slow; commonly cycled. Clinician guidance advised."},
  "sermorelin":{ev:"human",over:"A GHRH analog used to nudge natural growth-hormone release, usually dosed at night. Gradual, cycle-based.",phases:[
    {s:1,e:2,label:"Weeks 1–2",title:"Sleep",body:"Deeper sleep is often the first noticeable change."},
    {s:3,e:12,label:"Weeks 3–12",title:"Recovery & composition",body:"Recovery and slow body-composition changes build over months."}],
    note:"Effects are gradual; periodic breaks are common."},
  "glutathione":{ev:"human",over:"The body’s master antioxidant. Injected (subcutaneous or IM) it’s used to support oxidative-stress defense and even skin tone. Skin-tone evidence is the strongest; broad ‘detox’ claims are weak.",phases:[
    {s:1,e:4,label:"Weeks 1–4",title:"Subtle start",body:"Early effects are quiet; some report skin clarity or a mild energy lift."},
    {s:5,e:12,label:"Weeks 4–12",title:"Skin tone",body:"Skin-tone evenness/brightening tends to show over weeks to months with consistent injections."}],
    note:"Evidence is strongest for skin and oxidative-stress support; treat general ‘detox’ claims skeptically. Response varies."},
  "epitalon":{ev:"early",over:"A synthetic peptide (mostly Russian research) studied around aging, sleep, and circadian rhythm. Independent human data are limited; usually run in short cycles.",phases:[
    {s:1,e:2,label:"Weeks 1–2",title:"Sleep/rhythm",body:"Some users report better sleep and rhythm during a short course."},
    {s:3,e:999,label:"Cycle",body:"Typically used as a defined short cycle rather than continuously.",title:"Short cycle"}],
    note:"Limited independent human evidence; anecdotal. Discuss with a clinician."},
  "semax":{ev:"early",over:"A nootropic peptide studied mainly in Russia for focus, cognition, and neuroprotection. Used during the day.",phases:[
    {s:1,e:1,label:"Week 1",title:"Acute focus",body:"Some report sharper focus or clarity fairly quickly after dosing."},
    {s:2,e:999,label:"Ongoing",title:"Day-to-day",body:"Often used situationally for focus; Western trial data are limited."}],
    note:"Most research is Russian; limited independent trials."},
  "selank":{ev:"early",over:"An anxiolytic peptide studied mainly in Russia for calm without sedation.",phases:[
    {s:1,e:1,label:"Week 1",title:"Calm",body:"Some report a calmer baseline without drowsiness soon after dosing."},
    {s:2,e:999,label:"Ongoing",title:"Day-to-day",body:"Used situationally; independent trial data are limited."}],
    note:"Mostly Russian research; anecdotal in Western use."},
  "tesamorelin":{ev:"trial",over:"A GHRH analog that is FDA-approved to reduce excess visceral (deep abdominal) fat in a specific population; studied with real trial data.",phases:[
    {s:1,e:4,label:"Weeks 1–4",title:"Easing in",body:"Nightly dosing; sleep and recovery changes may show first."},
    {s:5,e:26,label:"Weeks 4–26",title:"Visceral fat",body:"Visceral-fat reduction built over ~3–6 months in trials."}],
    note:"Effects are gradual; clinician-monitored (including IGF-1)."},
  "mots-c":{ev:"early",over:"A mitochondrial-derived peptide studied for metabolism and exercise capacity. Evidence is largely preclinical.",phases:[
    {s:1,e:4,label:"Weeks 1–4",title:"Subtle",body:"Some report energy or workout changes; effects are subtle and unproven in humans."},
    {s:5,e:999,label:"Ongoing",title:"Cycle",body:"Usually run in cycles."}],
    note:"Preclinical/anecdotal; human data limited."},
  "pt-141":{ev:"trial",over:"Bremelanotide — FDA-approved for low sexual desire in some women; acts on the brain rather than blood flow. Used as needed, not daily.",phases:[
    {s:1,e:999,label:"As needed",title:"Acute effect",body:"Taken ahead of time rather than on a schedule; effects are acute. Flushing or nausea can occur."}],
    note:"Used situationally; clinician guidance advised."},
};

const SEED = (today) => ([
  { id:"p_ghkcu", name:"GHK-Cu",      dose:"", color:"#c77d4a", time:"20:00", startDate:today, schedule:{type:"daily"} },
  { id:"p_reta",  name:"Retatrutide", dose:"", color:"#4f7cc4", time:"20:00", startDate:today, schedule:{type:"weekly",days:[0]} },
  { id:"p_nad",   name:"NAD+",        dose:"", color:"#8a6fd1", time:"07:30", startDate:today, schedule:{type:"everyN",n:2} },
  { id:"p_glut",  name:"Glutathione", dose:"", color:"#4fa76b", time:"07:30", startDate:today, schedule:{type:"weekly",days:[1,2,3,4,5]} },
]);

const pad = (n)=>String(n).padStart(2,"0");
const dateKey = (d)=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const parseKey = (k)=>{const[y,m,dd]=k.split("-").map(Number);return new Date(y,m-1,dd);};
const addDays = (d,n)=>{const x=new Date(d);x.setDate(x.getDate()+n);return x;};
const dayDiff = (a,b)=>Math.round((parseKey(dateKey(a))-parseKey(dateKey(b)))/86400000);
const tmin = (t)=>{if(!t)return 1440;const[h,m]=t.split(":").map(Number);return h*60+m;};

function latestDoseKey(pid,logs){let best=null;for(const k of Object.keys(logs||{})){if(!k.startsWith(pid+"__"))continue;const dk=k.split("__")[1];if(!best||dk>best)best=dk;}return best;}
function isDue(p,d,logs){
  const start=parseKey(p.startDate), day=parseKey(dateKey(d));
  if(day<start)return false;
  const s=p.schedule;
  if(s.type==="daily")return true;
  if(s.type==="everyN"){
    if(logs){const dk=dateKey(day);let prior=null;for(const k of Object.keys(logs)){if(!k.startsWith(p.id+"__"))continue;const kk=k.split("__")[1];if(kk<dk&&(!prior||kk>prior))prior=kk;}if(prior)return dayDiff(day,parseKey(prior))>=s.n;}
    const base=p.anchor?parseKey(p.anchor):start;
    if(day<base)return false;
    return dayDiff(day,base)%s.n===0;
  }
  if(s.type==="weekly")return (s.days||[]).includes(day.getDay());
  return false;
}
function scheduleLabel(p){
  const s=p.schedule;
  if(s.type==="daily")return "Daily";
  if(s.type==="everyN")return `Every ${s.n} days`;
  if(s.type==="weekly"){
    const ds=(s.days||[]).slice().sort((a,b)=>a-b);
    if(ds.length===7)return "Daily";
    if(ds.length===5&&ds.join()==="1,2,3,4,5")return "Mon–Fri";
    if(ds.length===1)return `${DOW[ds[0]]}s`;
    return ds.map(i=>DOW[i]).join(", ");
  }
  return "";
}
function dosesPerDay(p){const s=p.schedule;if(s.type==="daily")return 1;if(s.type==="everyN")return 1/s.n;if(s.type==="weekly")return (s.days?.length||0)/7;return 0;}
function nextDoseAt(p,now,logs){
  for(let i=0;i<90;i++){const d=addDays(now,i);
    if(isDue(p,d,logs)){const[h,m]=(p.time||"09:00").split(":").map(Number);const dt=new Date(d.getFullYear(),d.getMonth(),d.getDate(),h,m,0,0);if(dt.getTime()>=now.getTime()-30000)return dt;}}
  return null;
}
function fmtTime(t){if(!t)return "";const[h,m]=t.split(":").map(Number);const ap=h>=12?"PM":"AM";return `${h%12||12}:${pad(m)} ${ap}`;}
function fmtGap(ms){if(ms<=60000)return "now";const m=Math.round(ms/60000);if(m<60)return `${m}m`;const h=Math.floor(m/60);if(h<24)return `${h}h ${m%60}m`;const d=Math.floor(h/24);return `${d}d ${h%24}h`;}
function cycleState(p,now){if(!p.cycle)return null;const{on,off}=p.cycle,total=on+off;const w=Math.floor(dayDiff(now,parseKey(p.startDate))/7);if(w<0)return null;const pos=((w%total)+total)%total,onPhase=pos<on;return{onPhase,week:onPhase?pos+1:pos-on+1,len:onPhase?on:off};}
function supplyState(p,logs,now){
  if(!p.supply)return null;
  const today=dateKey(now);
  const perVial=dosesInVial(p.recon,p.supply.vialMl);
  let total=null;
  if(p.supply.doses!=null)total=p.supply.doses;                 // legacy / manual
  else if(perVial!=null&&p.supply.vials)total=perVial*p.supply.vials; // computed
  if(total==null)return {unknown:true,perVial,vials:p.supply.vials};
  const used=Object.keys(logs).filter(k=>k.startsWith(p.id+"__")&&k.split("__")[1]<=today).length;
  const remaining=Math.max(0,total-used), rate=dosesPerDay(p);
  const daysLeft=rate>0?Math.floor(remaining/rate):null;
  return{remaining,total,perVial,daysLeft,outDate:daysLeft!=null?addDays(now,daysLeft):null};
}
/* dose draw math — pure arithmetic, never a recommendation */
function calcDraw(r){
  if(!r)return null;
  if(r.mode==="units"){const u=r.units;if(!(u>0))return null;const mL=u/100;const conc=r.conc>0?r.conc:null;const doseMg=conc?mL*conc:null;return{conc,mL,units:u,doseMg,perVial:null,warn:u>100?"over":null};}
  const{mode,conc:rConc,vialMg,waterMl,doseVal,doseUnit}=r;
  const premixed=mode==="premixed";
  const conc=premixed?rConc:(vialMg>0&&waterMl>0?vialMg/waterMl:0); // mg/mL
  if(!(conc>0&&doseVal>0))return null;
  const doseMg=doseUnit==="mcg"?doseVal/1000:doseVal;
  const mL=doseMg/conc, units=mL*100;
  const perVial=(!premixed&&vialMg>0&&doseMg>0)?Math.floor(vialMg/doseMg):null;
  let warn=null; if(units>100)warn="over"; else if(units<2)warn="tiny";
  return{conc,mL,units,doseMg,perVial,warn};
}
const fmtMg=(mg)=>mg==null?"":`${+mg.toFixed(mg<0.1?3:2)} mg`;
function dosesInVial(recon,vialMl){
  if(!recon)return null;
  if(recon.mode==="mix"){const dm=recon.doseUnit==="mcg"?recon.doseVal/1000:recon.doseVal;return recon.vialMg>0&&dm>0?Math.floor(recon.vialMg/dm):null;}
  if(recon.mode==="units")return recon.units>0&&vialMl>0?Math.floor((vialMl*100)/recon.units):null;
  if(recon.mode==="premixed"){const dm=recon.doseUnit==="mcg"?recon.doseVal/1000:recon.doseVal;return recon.conc>0&&dm>0&&vialMl>0?Math.floor((recon.conc*vialMl)/dm):null;}
  return null;
}
function siteRecency(map,id,now){const last=map?.[id];if(!last)return{days:Infinity,label:"never"};const days=dayDiff(now,parseKey(last));return{days,label:days===0?"today":days===1?"1d ago":`${days}d ago`};}
function suggestSite(map,now){let best=SITES[0],bd=-1;SITES.forEach(s=>{const d=siteRecency(map,s.id,now).days;const dd=d===Infinity?9999:d;if(dd>bd){bd=dd;best=s;}});return best;}
function peptideSiteMap(metrics,pid){const m={},ds=metrics?.doseSites||{};Object.keys(ds).forEach(k=>{const idx=k.lastIndexOf("__");const p=k.slice(0,idx),date=k.slice(idx+2),sid=ds[k];if(p===pid&&(!m[sid]||date>m[sid]))m[sid]=date;});return m;}

const ACHIEVEMENTS=[
  {id:"first",emoji:"💉",name:"First Dose",desc:"Log your first dose",test:s=>s.total>=1},
  {id:"week",emoji:"🔥",name:"On Fire",desc:"7-day streak",test:s=>s.best>=7},
  {id:"month",emoji:"🏆",name:"Iron Discipline",desc:"30-day streak",test:s=>s.best>=30},
  {id:"ninety",emoji:"💎",name:"Diamond",desc:"90-day streak",test:s=>s.best>=90},
  {id:"perfect",emoji:"🎯",name:"Flawless",desc:"100% over 30d",test:s=>s.due30>=15&&s.adherence>=1},
  {id:"century",emoji:"💯",name:"Centurion",desc:"100 doses",test:s=>s.total>=100},
  {id:"elite",emoji:"👑",name:"Elite",desc:"500 doses",test:s=>s.total>=500},
  {id:"dialed",emoji:"📈",name:"Dialed In",desc:"90%+ over 30d",test:s=>s.due30>=15&&s.adherence>=0.9},
];
function smartInsight(peptides,logs,now){
  const taken=(id,d)=>!!logs[`${id}__${dateKey(d)}`];
  let amDue=0,amHit=0,pmDue=0,pmHit=0;
  for(let i=0;i<21;i++){const d=addDays(now,-i);peptides.forEach(p=>{if(!isDue(p,d,logs))return;const am=tmin(p.time)<720,hit=taken(p.id,d);if(am){amDue++;if(hit)amHit++;}else{pmDue++;if(hit)pmHit++;}});}
  const amR=amDue?amHit/amDue:1,pmR=pmDue?pmHit/pmDue:1, s=fullStats(peptides,logs,now);
  if(s.streak>=7)return{icon:"flame",text:`You’re on a ${s.streak}-day streak — your best is ${s.best}. Keep it rolling.`};
  if(amDue>=4&&pmDue>=4&&Math.abs(amR-pmR)>=0.25)
    return amR<pmR?{icon:"clock",text:`Mornings are your weak spot — ${Math.round(amR*100)}% logged vs ${Math.round(pmR*100)}% in the evening.`}
                  :{icon:"clock",text:`Evenings slip more — ${Math.round(pmR*100)}% logged vs ${Math.round(amR*100)}% in the morning.`};
  if(s.adherence>=0.9&&s.due30>=10)return{icon:"trend",text:`${Math.round(s.adherence*100)}% adherence over 30 days — you’re dialed in.`};
  if(s.due30>0)return{icon:"trend",text:`${Math.round(s.adherence*100)}% adherence over the last 30 days. Small wins compound.`};
  return{icon:"trend",text:`Log a few days to unlock personalized insights.`};
}

function StatusRing({items,size=184,stroke=15}){
  const r=(size-stroke)/2,C=2*Math.PI*r,N=items.length;
  if(N===0)return <svg width={size} height={size}><circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--line-2)" strokeWidth={stroke}/></svg>;
  const segA=360/N,gap=N>1?Math.min(11,segA*0.16):0,arcA=segA-gap,arcLen=C*arcA/360;
  return(<svg width={size} height={size}><g transform={`rotate(-90 ${size/2} ${size/2})`}>
    <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--line-2)" strokeWidth={stroke}/>
    {items.map((it,i)=>(<circle key={i} cx={size/2} cy={size/2} r={r} fill="none" stroke={it.color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={`${arcLen} ${C}`} transform={`rotate(${i*segA+gap/2} ${size/2} ${size/2})`} style={{opacity:it.done?1:0,transition:"opacity .5s"}}/>))}
  </g></svg>);
}

/* ============================================================================ */
export default function App(){
  const[peptides,setPeptides]=useState([]);
  const[logs,setLogs]=useState({});
  const[metrics,setMetrics]=useState({unit:"lb",entries:{},energy:{},sites:{},recovery:{},labs:[],doseSites:{}});
  const[loaded,setLoaded]=useState(false);
  const[tab,setTab]=useState("today");
  const[editing,setEditing]=useState(null);
  const[clock,setClock]=useState(Date.now());
  const[ai,setAi]=useState(null);
  const[aiLoading,setAiLoading]=useState(false);
  const[aiError,setAiError]=useState(null);
  const[celebrate,setCelebrate]=useState(false);
  const[share,setShare]=useState(false);
  const[showProtocols,setShowProtocols]=useState(false);
  const[showClinic,setShowClinic]=useState(false);
  const[showProvider,setShowProvider]=useState(false);
  const[clinicId,setClinicId]=useState(null);
  const[journeyPeptide,setJourneyPeptide]=useState(null);
  const[historyPeptide,setHistoryPeptide]=useState(null);
  const[pickSite,setPickSite]=useState(null);
  const[user,setUser]=useState(null);
  const[showAccount,setShowAccount]=useState(false);
  const wasComplete=useRef(false);
  const now=new Date(clock);

  useEffect(()=>{let on=true;supabase?.auth?.getUser().then(({data})=>{if(on)setUser(data?.user||null);});return()=>{on=false;};},[]);
  useEffect(()=>{const id=setInterval(()=>setClock(Date.now()),30000);return()=>clearInterval(id);},[]);
  useEffect(()=>{(async()=>{
    let have=false;
    try{const p=await window.storage.get("peptides");if(p?.value){const a=JSON.parse(p.value);setPeptides(a);have=Array.isArray(a)&&a.length>0;}}catch(e){}
    if(!have)setPeptides(SEED(dateKey(new Date())));
    try{const l=await window.storage.get("logs");if(l?.value)setLogs(JSON.parse(l.value));}catch(e){}
    try{const m=await window.storage.get("metrics");if(m?.value)setMetrics(x=>({...x,...JSON.parse(m.value)}));}catch(e){}
    try{const a=await window.storage.get("ai_pairings");if(a?.value)setAi(JSON.parse(a.value));}catch(e){}
    try{const c=await window.storage.get("clinic_id");if(c?.value)setClinicId(JSON.parse(c.value));}catch(e){}
    setLoaded(true);
  })();},[]);
  useEffect(()=>{if(loaded)window.storage.set("peptides",JSON.stringify(peptides),false).catch(()=>{});},[peptides,loaded]);
  useEffect(()=>{if(loaded)window.storage.set("logs",JSON.stringify(logs),false).catch(()=>{});},[logs,loaded]);
  useEffect(()=>{if(loaded)window.storage.set("metrics",JSON.stringify(metrics),false).catch(()=>{});},[metrics,loaded]);
  useEffect(()=>{if(loaded)window.storage.set("clinic_id",JSON.stringify(clinicId),false).catch(()=>{});},[clinicId,loaded]);
  const clinic=useMemo(()=>CLINICS.find(c=>c.id===clinicId)||null,[clinicId]);

  const lk=(id,d)=>`${id}__${dateKey(d)}`;
  const taken=(id,d)=>!!logs[lk(id,d)];
  const logDose=(id)=>{
    const p=peptides.find(x=>x.id===id);
    const wasLogged=!!logs[lk(id,now)];
    setLogs(prev=>{const c={...prev},k=lk(id,now);if(c[k])delete c[k];else c[k]=new Date().toISOString();return c;});
    if(p&&p.rotate!==false){
      setMetrics(m=>{const k=`${id}__${dateKey(now)}`,ds={...(m.doseSites||{})};if(wasLogged)delete ds[k];else if(!ds[k])ds[k]=suggestSite(peptideSiteMap(m,id),now).id;return{...m,doseSites:ds};});
    }
  };
  const setDoseSite=(pid,sid)=>{
    setMetrics(m=>({...m,doseSites:{...(m.doseSites||{}),[`${pid}__${dateKey(now)}`]:sid}}));
    setLogs(prev=>{const k=lk(pid,now);if(prev[k])return prev;return{...prev,[k]:new Date().toISOString()};});
  };
  const toggleLogOn=(pid,dk)=>{
    const key=`${pid}__${dk}`, p=peptides.find(x=>x.id===pid), was=!!logs[key];
    setLogs(prev=>{const c={...prev};if(c[key])delete c[key];else c[key]=new Date(dk+"T12:00:00").toISOString();return c;});
    if(p&&p.rotate!==false)setMetrics(m=>{const ds={...(m.doseSites||{})};if(was)delete ds[key];else if(!ds[key])ds[key]=suggestSite(peptideSiteMap(m,pid),parseKey(dk)).id;return{...m,doseSites:ds};});
  };
  const removeFromToday=(pid)=>{
    const p=peptides.find(x=>x.id===pid), tk=dateKey(now);
    setLogs(prev=>{const c={...prev};delete c[`${pid}__${tk}`];return c;});
    setMetrics(m=>{const ds={...(m.doseSites||{})};delete ds[`${pid}__${tk}`];const sk={...(m.skips||{})};sk[`${pid}__${tk}`]=true;return{...m,doseSites:ds,skips:sk};});
    if(p&&p.schedule.type==="everyN")setPeptides(prev=>prev.map(x=>x.id===pid?{...x,anchor:dateKey(addDays(now,1))}:x));
  };

  const dueToday=useMemo(()=>peptides.filter(p=>isDue(p,now,logs)&&!((metrics.skips||{})[`${p.id}__${dateKey(now)}`])).sort((a,b)=>tmin(a.time)-tmin(b.time)),[peptides,clock,logs,metrics]);
  const doneToday=dueToday.filter(p=>taken(p.id,now)).length;
  const completeAll=dueToday.length>0&&doneToday===dueToday.length;
  useEffect(()=>{
    if(completeAll&&!wasComplete.current){setCelebrate(true);wasComplete.current=true;const t=setTimeout(()=>setCelebrate(false),2600);return()=>clearTimeout(t);}
    if(!completeAll)wasComplete.current=false;
  },[completeAll]);

  const logAll=()=>{
    setLogs(prev=>{const c={...prev};dueToday.forEach(p=>{if(!c[lk(p.id,now)])c[lk(p.id,now)]=new Date().toISOString();});return c;});
    setMetrics(m=>{const ds={...(m.doseSites||{})};dueToday.forEach(p=>{if(p.rotate!==false){const k=`${p.id}__${dateKey(now)}`;if(!ds[k])ds[k]=suggestSite(peptideSiteMap({doseSites:ds},p.id),now).id;}});return{...m,doseSites:ds};});
  };
  const addWeight=(v)=>setMetrics(m=>({...m,entries:{...m.entries,[dateKey(now)]:v}}));
  const setUnit=(u)=>setMetrics(m=>({...m,unit:u}));
  const addEnergy=(v)=>setMetrics(m=>({...m,energy:{...(m.energy||{}),[dateKey(now)]:v}}));
  const addRecovery=(field,v)=>setMetrics(m=>({...m,recovery:{...(m.recovery||{}),[dateKey(now)]:{...((m.recovery||{})[dateKey(now)]||{}),[field]:v}}}));
  const addLab=(e)=>setMetrics(m=>({...m,labs:[...(m.labs||[]),e]}));
  const deleteLab=(id)=>setMetrics(m=>({...m,labs:(m.labs||[]).filter(l=>l.id!==id)}));

  const savePeptide=(p)=>{setPeptides(prev=>prev.some(x=>x.id===p.id)?prev.map(x=>x.id===p.id?p:x):[...prev,p]);setEditing(null);};
  const deletePeptide=(id)=>{setPeptides(prev=>prev.filter(x=>x.id!==id));setLogs(prev=>{const c={...prev};Object.keys(c).forEach(k=>{if(k.startsWith(id+"__"))delete c[k];});return c;});setEditing(null);};
  const applyProtocol=(tpl)=>{
    const today=dateKey(new Date());
    setPeptides(prev=>{
      const have=new Set(prev.map(p=>p.name.toLowerCase()));
      const adds=tpl.peptides.filter(tp=>!have.has(tp.name.toLowerCase())).map((tp,i)=>({id:"p_"+Date.now().toString(36)+i,name:tp.name,dose:"",color:tp.color,time:tp.time,startDate:today,schedule:tp.schedule}));
      return[...prev,...adds];
    });
    setShowProtocols(false); setTab("stacks");
  };
  const addCatalogProduct=(prod)=>{
    const today=dateKey(new Date());
    setPeptides(prev=>{
      if(prev.some(p=>p.name.toLowerCase()===prod.name.toLowerCase()))return prev;
      const r=prod.recon;
      const recon=r?(r.mode==="mix"?{mode:"mix",vialMg:r.vialMg||0,waterMl:r.waterMl||0,doseVal:r.doseVal||0,doseUnit:r.doseUnit||"mcg"}:r.mode==="premixed"?{mode:"premixed",conc:r.conc||0,doseVal:r.doseVal||0,doseUnit:r.doseUnit||"mcg"}:{mode:"units",units:r.units||0}):undefined;
      return[...prev,{id:"p_"+Date.now().toString(36),name:prod.name,dose:"",color:prod.color,time:prod.time,startDate:today,rotate:prod.rotate!==false,recon,schedule:prod.schedule}];
    });
  };

  const stackSig=useMemo(()=>peptides.map(p=>`${p.name}|${scheduleLabel(p)}`).join(";"),[peptides]);
  async function analyzeStack(){
    setAiError(null); setAiLoading(true);
    const list=peptides.map(p=>`${p.name} — ${scheduleLabel(p)}${p.time?` at ${fmtTime(p.time)}`:""}`).join("; ");
    try{
      const res=await fetch(`${import.meta.env.VITE_API_BASE || ""}/api/anthropic`,{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1000,
          system:"You are a careful wellness-information assistant inside a peptide-tracking app. Offer GENERAL, EDUCATIONAL information about dietary supplements commonly discussed as supportive alongside the user's regimen. You are NOT a doctor: never give personalized medical advice, diagnoses, treatment plans, or doses/amounts. Flag interactions or cautions — especially with prescription or investigational compounds (e.g. GLP-1 class drugs) — and encourage consulting a clinician or pharmacist. Output MINIFIED JSON ONLY: no markdown, no code fences, no text outside the JSON. Keep it concise (well under 250 words).",
          messages:[{role:"user",content:`Regimen: ${list}.\n\nSuggest 4-6 widely-discussed supportive supplements people often pair with a regimen like this. No doses. Keep every string short.\n\nReturn exactly this JSON shape: {"summary":"1 sentence","suggestions":[{"name":"","category":"e.g. Mineral/Vitamin/Amino acid/Antioxidant","rationale":"<=15 words","timing":"short e.g. Morning / With food","caution":"optional, short"}],"interactions":["short note specific to this regimen"],"disclaimer":"1 short sentence"}`}]})});
      let data=null; try{data=await res.json();}catch(_){}
      if(!res.ok||!data||data.type==="error"){throw new Error(data?.error?.message||`Request failed (HTTP ${res.status})`);}
      const text=(Array.isArray(data.content)?data.content:[]).filter(b=>b&&b.type==="text").map(b=>b.text).join("\n");
      if(!text.trim())throw new Error("The model returned an empty response.");
      const clean=text.replace(/```json|```/g,"").trim();
      const st=clean.indexOf("{"),en=clean.lastIndexOf("}");
      if(st===-1||en===-1)throw new Error("Couldn’t read the model’s response.");
      let parsed; try{parsed=JSON.parse(clean.slice(st,en+1));}catch(_){throw new Error("The response wasn’t valid JSON. Try again.");}
      const result={summary:parsed.summary||"",suggestions:Array.isArray(parsed.suggestions)?parsed.suggestions:[],interactions:Array.isArray(parsed.interactions)?parsed.interactions:[],disclaimer:parsed.disclaimer||""};
      if(result.suggestions.length===0)throw new Error("No suggestions came back. Try again.");
      const payload={sig:stackSig,result};setAi(payload);window.storage.set("ai_pairings",JSON.stringify(payload),false).catch(()=>{});
    }catch(e){setAiError(e?.message?String(e.message):"Couldn’t generate suggestions right now. Please try again.");}
    finally{setAiLoading(false);}
  }

  if(!loaded)return <div className="pos-root" style={{alignItems:"center",justifyContent:"center"}}><style>{CSS}</style><Syringe size={26} color="var(--ink-3)"/></div>;

  const clinicTheme=clinic?{"--accent":clinic.accent,"--accent-soft":clinic.accentSoft,"--accent-ink":clinic.accentInk}:undefined;

  return(
    <div className="pos-root" style={clinicTheme}>
      <style>{CSS}</style>
      <div className="pos-scroll">
        {tab==="today"&&<Today now={now} due={dueToday} done={doneToday} taken={taken} onLog={logDose} onRemove={removeFromToday} logAll={logAll} logs={logs} peptides={peptides} metrics={metrics} clinic={clinic} addEnergy={addEnergy} onPickSite={p=>setPickSite(p)} onClinic={()=>setShowClinic(true)} onAdd={()=>setEditing("new")} onShare={()=>setShare(true)} user={user} onAccount={()=>setShowAccount(true)}/>}
        {tab==="stacks"&&<Stacks peptides={peptides} logs={logs} metrics={metrics} now={now} clinic={clinic} onEdit={p=>setEditing(p)} onAdd={()=>setEditing("new")} onBrowse={()=>setShowProtocols(true)} onClinic={()=>setShowClinic(true)} onJourney={p=>setJourneyPeptide(p)} onHistory={p=>setHistoryPeptide(p)}/>}
        {tab==="tools"&&<Tools peptides={peptides} logs={logs} metrics={metrics} now={now}/>}
        {tab==="pair"&&<Pairings peptides={peptides} ai={ai} loading={aiLoading} error={aiError} stale={ai&&ai.sig!==stackSig} onRun={analyzeStack} onAdd={()=>setEditing("new")}/>}
        {tab==="insights"&&<Insights peptides={peptides} logs={logs} metrics={metrics} now={now} addWeight={addWeight} setUnit={setUnit} addRecovery={addRecovery} addLab={addLab} deleteLab={deleteLab} onShare={()=>setShare(true)}/>}
      </div>
      <nav className="pos-tabs">
        <Tab icon={Zap} label="Today" active={tab==="today"} onClick={()=>setTab("today")}/>
        <Tab icon={Layers} label="Stacks" active={tab==="stacks"} onClick={()=>setTab("stacks")}/>
        <Tab icon={Calculator} label="Tools" active={tab==="tools"} onClick={()=>setTab("tools")}/>
        <Tab icon={Sparkles} label="Pairings" active={tab==="pair"} onClick={()=>setTab("pair")}/>
        <Tab icon={Activity} label="Insights" active={tab==="insights"} onClick={()=>setTab("insights")}/>
      </nav>
      {celebrate&&<Confetti/>}
      <ShareCard open={share} peptides={peptides} logs={logs} now={now} onClose={()=>setShare(false)}/>
      <ProtocolLibrary open={showProtocols} clinic={clinic} onClose={()=>setShowProtocols(false)} onApply={applyProtocol} peptides={peptides}/>
      <ClinicSheet open={showClinic} clinic={clinic} peptides={peptides} onConnect={(id)=>setClinicId(id)} onDisconnect={()=>setClinicId(null)} onAddProduct={addCatalogProduct} onOpenProvider={()=>{setShowClinic(false);setShowProvider(true);}} onClose={()=>setShowClinic(false)}/>
      <ProviderDashboard open={showProvider} clinic={clinic} peptides={peptides} logs={logs} now={now} onClose={()=>setShowProvider(false)}/>
      <JourneySheet open={!!journeyPeptide} peptide={journeyPeptide} now={now} onClose={()=>setJourneyPeptide(null)}/>
      <SitePicker open={!!pickSite} peptide={pickSite} metrics={metrics} now={now} onPick={(sid)=>{setDoseSite(pickSite.id,sid);setPickSite(null);}} onClose={()=>setPickSite(null)}/>
      <EditSheet key={editing==="new"?"new":editing?.id||"closed"} open={!!editing} peptide={editing==="new"?null:editing} onClose={()=>setEditing(null)} onSave={savePeptide} onDelete={deletePeptide} onHistory={p=>setHistoryPeptide(p)}/>
      <HistorySheet open={!!historyPeptide} peptide={historyPeptide} logs={logs} now={now} onToggle={toggleLogOn} onClose={()=>setHistoryPeptide(null)}/>
      <AccountSheet open={showAccount} user={user} clinic={clinic} metrics={metrics} onClose={()=>setShowAccount(false)} now={now}/>
    </div>
  );
}

function Tab({icon:Icon,label,active,onClick}){return(<button className={`pos-tab ${active?"active":""}`} onClick={onClick}><Icon size={21} strokeWidth={active?2.4:2}/><span className="pos-tab-lbl">{label}</span></button>);}

/* ---------- ACCOUNT SHEET ---------- */
function AccountSheet({open,user,clinic,metrics,now,onClose}){
  const[render,setRender]=useState(open),[anim,setAnim]=useState(false);
  const[editName,setEditName]=useState(false),[name,setName]=useState("");
  const[nameLoading,setNameLoading]=useState(false);
  const[deleteConfirm,setDeleteConfirm]=useState(false);
  const[deleteBusy,setDeleteBusy]=useState(false);
  const[reminderTime,setReminderTime]=useState("09:00");
  const[notifyOn,setNotifyOn]=useState(true);
  const[unit,setUnit]=useState("lb");
  useEffect(()=>{if(open){setRender(true);requestAnimationFrame(()=>setAnim(true));}else{setAnim(false);const t=setTimeout(()=>setRender(false),420);return()=>clearTimeout(t);}},[open]);
  useEffect(()=>{if(user){setName(user.user_metadata?.name||"");setUnit((metrics?.unit||"lb"));}},[ user,metrics]);
  if(!render||!user)return null;
  const initials=(name||user.email||"?").split(" ").map(p=>p[0]).join("").slice(0,2).toUpperCase();
  const memberSince=user.created_at?new Date(user.created_at).toLocaleDateString(undefined,{month:"long",day:"numeric",year:"numeric"}):"—";
  const saveName=async()=>{
    if(!name.trim())return;
    setNameLoading(true);
    try{
      await supabase.auth.updateUser({data:{...user.user_metadata,name:name.trim()}});
      setEditName(false);
    }catch(e){alert(`Couldn't save name: ${e.message}`);}
    setNameLoading(false);
  };
  const deleteAccount=async()=>{
    setDeleteBusy(true);
    try{
      await supabase.auth.admin.deleteUser(user.id);
      await supabase.auth.signOut();
    }catch(e){
      alert(`Couldn't delete account: ${e.message}`);
      setDeleteBusy(false);
    }
  };
  const signOut=async()=>{try{await supabase.auth.signOut();}catch(_){}};
  return(<>
    <div className={`pos-ov ${anim?"open":""}`} onClick={onClose}/>
    <div className={`pos-sheet ${anim?"open":""}`}>
      <div className="pos-grab"/>
      <div className="pos-snav"><button onClick={onClose}>Close</button><span className="pos-snav-t">Account</span><span style={{width:54}}/></div>
      <div className="pos-sbody">
        <div style={{display:"flex",alignItems:"center",gap:16,padding:"16px 4px 20px",borderBottom:"1px solid var(--line)"}}>
          <div style={{width:64,height:64,borderRadius:"50%",background:"var(--accent)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,fontWeight:800}}>{initials}</div>
          <div style={{flex:1,minWidth:0}}>
            {editName?<>
              <input type="text" value={name} onChange={e=>setName(e.target.value)} style={{width:"100%",border:"1px solid var(--line-2)",borderRadius:8,padding:"8px 12px",fontSize:14,fontFamily:"var(--sans)",marginBottom:6}} onKeyDown={e=>e.key==="Enter"&&saveName()}/>
              <div style={{display:"flex",gap:8}}><button onClick={saveName} disabled={nameLoading} style={{flex:1,background:"var(--accent)",color:"#fff",border:"none",borderRadius:6,padding:"6px 12px",fontSize:13,fontWeight:700,cursor:"pointer"}}>{nameLoading?"Saving…":"Save"}</button><button onClick={()=>setEditName(false)} style={{flex:1,background:"var(--surface-2)",border:"none",borderRadius:6,padding:"6px 12px",fontSize:13,fontWeight:700,cursor:"pointer"}}>Cancel</button></div>
            </>:<>
              <div style={{fontSize:18,fontWeight:780}}>{name||"—"}</div>
              <div style={{fontSize:13,color:"var(--ink-2)",marginTop:3}}>{user.email}</div>
              <button onClick={()=>setEditName(true)} style={{marginTop:8,background:"none",border:"none",fontSize:12,fontWeight:700,color:"var(--accent)",cursor:"pointer",padding:0}}>Edit name</button>
            </>}
          </div>
        </div>
        <div style={{padding:"16px 0 12px"}}>
          <div className="pos-eyebrow" style={{paddingLeft:6}}>Member since</div>
          <div style={{fontSize:15,fontWeight:680,padding:"10px 6px"}}>{memberSince}</div>
        </div>
        {clinic&&<div style={{borderTop:"1px solid var(--line)",paddingTop:16,marginBottom:14}}>
          <div className="pos-eyebrow" style={{paddingLeft:6,marginBottom:8}}>Connected care</div>
          <div style={{background:"var(--surface-2)",borderRadius:14,padding:"14px",border:"1px solid var(--line)"}}><div style={{fontSize:14,fontWeight:740,color:"#2f5d5a"}}>{clinic.name}</div><div style={{fontSize:12,color:"var(--ink-2)",marginTop:4}}>Status: Connected</div></div>
        </div>}
        <div style={{borderTop:"1px solid var(--line)",paddingTop:16,marginBottom:14}}>
          <div className="pos-eyebrow" style={{paddingLeft:6,marginBottom:10}}>Preferences</div>
          <div style={{background:"var(--surface)",borderRadius:12,overflow:"hidden"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 15px",borderBottom:"1px solid var(--line)"}}><span style={{fontSize:14,fontWeight:600}}>Notifications</span><button className={`pos-toggle ${notifyOn?"on":""}`} onClick={()=>setNotifyOn(!notifyOn)} style={{cursor:"pointer"}}/></div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 15px",borderBottom:"1px solid var(--line)"}}><span style={{fontSize:14,fontWeight:600}}>Units</span><select value={unit} onChange={e=>setUnit(e.target.value)} style={{border:"1px solid var(--line-2)",borderRadius:6,padding:"6px 10px",fontSize:13,fontFamily:"var(--sans)",cursor:"pointer",outline:"none"}}><option>lb</option><option>kg</option></select></div>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 15px"}}><span style={{fontSize:14,fontWeight:600}}>Reminder</span><input type="time" value={reminderTime} onChange={e=>setReminderTime(e.target.value)} style={{border:"1px solid var(--line-2)",borderRadius:6,padding:"6px 10px",fontSize:13,fontFamily:"var(--sans)",cursor:"pointer",outline:"none"}}/></div>
          </div>
        </div>
        <div style={{borderTop:"1px solid var(--line)",paddingTop:16}}>
          <div className="pos-eyebrow" style={{paddingLeft:6,marginBottom:10}}>Data &amp; privacy</div>
          <button style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 15px",background:"var(--surface)",border:"1px solid var(--line)",borderRadius:12,cursor:"pointer",marginBottom:8,fontSize:14,fontWeight:600,fontFamily:"var(--sans)"}}><span>Export my data</span><ExternalLink size={15}/></button>
          {deleteConfirm?<>
            <div style={{background:"var(--red-soft)",border:"1px solid var(--red)",borderRadius:12,padding:"13px 15px",marginBottom:8}}><div style={{fontSize:14,fontWeight:700,color:"var(--red)",marginBottom:10}}>Delete account?</div><div style={{fontSize:12,color:"var(--ink-2)",marginBottom:12,lineHeight:1.5}}>This will permanently delete your account and all your peptide logs, streaks, and settings. This cannot be undone.</div><div style={{display:"flex",gap:8}}><button onClick={deleteAccount} disabled={deleteBusy} style={{flex:1,background:"var(--red)",color:"#fff",border:"none",borderRadius:8,padding:"10px",fontSize:13,fontWeight:700,cursor:"pointer"}}>{deleteBusy?"Deleting…":"Delete"}</button><button onClick={()=>setDeleteConfirm(false)} style={{flex:1,background:"var(--surface)",border:"1px solid var(--line)",borderRadius:8,padding:"10px",fontSize:13,fontWeight:700,cursor:"pointer"}}>Cancel</button></div></div>
          </>:<button onClick={()=>setDeleteConfirm(true)} style={{width:"100%",padding:"13px 15px",background:"var(--surface-2)",border:"1px solid var(--line-2)",borderRadius:12,cursor:"pointer",fontSize:14,fontWeight:600,fontFamily:"var(--sans)",color:"var(--red)"}}>Delete my account</button>}
        </div>
        <button onClick={signOut} style={{width:"100%",marginTop:16,marginBottom:20,padding:"14px",background:"var(--ink)",color:"#fff",border:"none",borderRadius:12,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"var(--sans)"}}>Sign out</button>
        <div className="pos-note" style={{marginBottom:0}}><ShieldCheck size={13} style={{flexShrink:0,marginTop:1,color:"var(--accent)"}}/>Your data is encrypted and stored in your account. You control when you delete it.</div>
      </div>
    </div>
  </>);
}
function Confetti(){
  const pieces=useMemo(()=>Array.from({length:64},(_,i)=>({left:Math.random()*100,color:CONFETTI_COLORS[i%CONFETTI_COLORS.length],delay:Math.random()*0.5,dur:1.8+Math.random()*1.3,w:6+Math.random()*6,rot:Math.random()*360})),[]);
  return(<div className="pos-confetti">{pieces.map((p,i)=>(<span key={i} className="pos-cpiece" style={{left:`${p.left}%`,background:p.color,width:p.w,height:p.w*1.5,animationDelay:`${p.delay}s`,animationDuration:`${p.dur}s`,transform:`rotate(${p.rot}deg)`}}/>))}</div>);
}

/* ---------- TODAY ---------- */
function Today({now,due,done,taken,onLog,onRemove,logAll,logs,peptides,metrics,clinic,addEnergy,onPickSite,onClinic,onAdd,onShare,user,onAccount}){
  const items=due.map(p=>{const rotate=p.rotate!==false;return{...p,_taken:taken(p.id,now),_min:tmin(p.time),_rotate:rotate,_site:rotate?(metrics?.doseSites||{})[`${p.id}__${dateKey(now)}`]:null,_suggest:rotate?suggestSite(peptideSiteMap(metrics,p.id),now).id:null};});
  const nowMin=now.getHours()*60+now.getMinutes();
  const todayEnergy=(metrics?.energy||{})[dateKey(now)];
  let nextId=null,nextLabel="";
  const pending=items.filter(i=>!i._taken);
  if(pending.length){
    const overdue=pending.filter(i=>i._min<=nowMin).sort((a,b)=>a._min-b._min);
    const upcoming=pending.filter(i=>i._min>nowMin).sort((a,b)=>a._min-b._min);
    const t=overdue[0]||upcoming[0];nextId=t.id;
    if(overdue[0])nextLabel="now";else{const[h,m]=t.time.split(":").map(Number);const dt=new Date(now.getFullYear(),now.getMonth(),now.getDate(),h,m);nextLabel=fmtGap(dt-now);}
  }
  const streak=useMemo(()=>computeStreak(peptides,logs,now),[peptides,logs,now]);
  const adh=useMemo(()=>adherence(peptides,logs,now,30),[peptides,logs,now]);
  const dateStr=now.toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"});
  const allDone=due.length>0&&done===due.length;
  return(<>
    <div className="pos-head">
      <div><div className="pos-h-eyebrow">{dateStr}</div><div className="pos-title">Today</div></div>
      <div className="pos-head-actions">{user&&<button className="pos-iconbtn" onClick={onAccount} aria-label="Account" style={{fontSize:12,fontWeight:800,color:"var(--accent)"}}>{(user.user_metadata?.name||user.email||"?").split(" ")[0].slice(0,2).toUpperCase()}</button>}<button className="pos-iconbtn" onClick={onShare} aria-label="Share"><Share2 size={18}/></button><button className="pos-iconbtn" onClick={onAdd} aria-label="Add"><Plus size={21}/></button></div>
    </div>
    {clinic&&<ClinicBanner clinic={clinic} onManage={onClinic}/>}
    <div className="pos-hero">
      <div className="pos-ringwrap"><StatusRing items={items.map(i=>({color:i.color,done:i._taken}))}/>
        <div className="pos-ring-center">{due.length===0?<><div className="pos-ring-num" style={{fontSize:25}}>Rest day</div><div className="pos-eyebrow pos-ring-lbl">no doses</div></>:<><div className="pos-ring-num tnum">{done}<small>/{due.length}</small></div><div className="pos-eyebrow pos-ring-lbl">{allDone?"all done":"doses logged"}</div></>}</div>
      </div>
      <div className="pos-hero-stats">
        <div className="pos-hstat"><div className="pos-eyebrow">Streak</div><div className="pos-hstat-val tnum" style={{color:streak?"#c98a1e":"var(--ink)"}}>{streak}<span className="u">d</span></div></div>
        <div className="pos-hstat"><div className="pos-eyebrow">Next dose</div><div className="pos-hstat-val tnum" style={{color:"var(--accent)"}}>{due.length===0?"—":pending.length?nextLabel:"Done"}</div></div>
        <div className="pos-hstat"><div className="pos-eyebrow">30-day</div><div className="pos-hstat-val tnum">{Math.round(adh*100)}<span className="u">%</span></div></div>
      </div>
    </div>
    {due.length>0&&<>
      <div className="pos-sec"><div className="pos-eyebrow">Schedule</div>{pending.length>0?<button className="pos-logall" onClick={logAll}><CheckCheck size={14}/>Log all</button>:<div className="pos-sec-count tnum">{done}/{due.length} DONE</div>}</div>
      <div className="pos-tl"><div className="pos-tl-rail"/>{renderTimeline(items,nowMin,now,nextId,onLog,onPickSite,onRemove)}</div>
    </>}
    <div className="pos-sec"><div className="pos-eyebrow">Daily check-in</div>{todayEnergy&&<div className="pos-sec-count">Logged</div>}</div>
    <div className="pos-card" style={{padding:"16px 16px 18px"}}>
      <div style={{fontSize:15,fontWeight:600,marginBottom:13}}>How’s your energy today?</div>
      <div className="pos-energy">{[1,2,3,4,5].map(v=>(<button key={v} className={`pos-energy-btn ${todayEnergy===v?"sel":""}`} onClick={()=>addEnergy(v)}><span className="pos-energy-emoji">{["😴","😐","🙂","😃","⚡️"][v-1]}</span><span className="pos-energy-lbl">{["Low","Meh","Okay","Good","Peak"][v-1]}</span></button>))}</div>
    </div>
    {due.length===0&&<div style={{textAlign:"center",marginTop:6}}><NextRestInfo peptides={peptides} now={now} logs={logs}/><button className="pos-cta" style={{marginTop:16}} onClick={onAdd}>Add a peptide</button></div>}
  </>);
}
function renderTimeline(items,nowMin,now,nextId,onLog,onPickSite,onRemove){
  const out=[];let placed=false;
  items.forEach(it=>{
    if(!placed&&it._min>nowMin){out.push(<div className="pos-now" key="now"><span className="pos-now-dot"/><span className="pos-now-lbl tnum">Now · {fmtTime(`${pad(now.getHours())}:${pad(now.getMinutes())}`)}</span><span className="pos-now-line"/></div>);placed=true;}
    const isNext=it.id===nextId,overdue=!it._taken&&it._min<=nowMin,draw=calcDraw(it.recon);
    out.push(
      <div className="pos-tl-row" key={it.id} onClick={()=>onLog(it.id)}>
        <div className={`pos-node ${it._taken?"done":""}`} style={it._taken?{background:it.color,borderColor:it.color}:isNext?{borderColor:it.color}:{}}>{it._taken?<Check className="ck" size={16} strokeWidth={3.2}/>:<span style={{width:7,height:7,borderRadius:"50%",background:isNext?it.color:"var(--ink-3)"}}/>}</div>
        <div className="pos-tl-card" style={isNext&&!it._taken?{borderColor:`${it.color}66`}:{}}>
          <div className="pos-tl-top"><span className="pos-tl-name" style={{flex:1,color:it._taken?"var(--ink-2)":"var(--ink)"}}>{it.name}</span><span className="pos-tl-time tnum">{fmtTime(it.time)}</span>{onRemove&&<button className="pos-card-x" title="Remove from today" onClick={(e)=>{e.stopPropagation();onRemove(it.id);}}><X size={13}/></button>}</div>
          <div className="pos-tl-meta">{it.dose&&<span>{it.dose}</span>}{it.dose&&<span style={{opacity:.4}}>·</span>}<span>{scheduleLabel(it)}</span>
            {draw&&!draw.warn&&<span className="pos-draw"><Syringe size={11}/>Draw {draw.units<10?draw.units.toFixed(1):Math.round(draw.units)}u</span>}
            {draw&&draw.warn&&<span className="pos-draw" style={{background:"var(--amber-soft)",color:"var(--amber)"}}><AlertTriangle size={11}/>Check draw</span>}
            {isNext&&!it._taken&&<span className="pos-pill" style={{marginLeft:"auto",background:`${it.color}1c`,color:it.color}}>{overdue?"Due now":"Next"}</span>}
            {it._taken&&<span className="pos-pill" style={{marginLeft:"auto",background:"var(--accent-soft)",color:"var(--accent-ink)"}}>Logged</span>}</div>
          {it._rotate&&<div className="pos-tl-site" onClick={(e)=>{e.stopPropagation();onPickSite(it);}}>
            <MapPin size={12}/>{it._taken?(it._site?`Injected · ${siteShort(it._site)}`:"Add site"):`Next site · ${siteShort(it._suggest)}`}
            <ChevronRight size={13} style={{marginLeft:"auto",opacity:.5}}/>
          </div>}
        </div>
      </div>);
  });
  if(!placed)out.push(<div className="pos-now" key="now"><span className="pos-now-dot"/><span className="pos-now-lbl tnum">Now · {fmtTime(`${pad(now.getHours())}:${pad(now.getMinutes())}`)}</span><span className="pos-now-line"/></div>);
  return out;
}
function NextRestInfo({peptides,now,logs}){let best=null;peptides.forEach(p=>{const dt=nextDoseAt(p,now,logs);if(dt&&(!best||dt<best.dt))best={p,dt};});if(!best)return <div className="pos-empty-s">Nothing scheduled. Enjoy the rest day.</div>;return <div className="pos-empty-s">Nothing due today. Next up: <b style={{color:best.p.color}}>{best.p.name}</b> in {fmtGap(best.dt-now)}.</div>;}

/* ---------- STACKS ---------- */
function Stacks({peptides,logs,metrics,now,clinic,onEdit,onAdd,onBrowse,onClinic,onJourney,onHistory}){
  const taken=(id,d)=>!!logs[`${id}__${dateKey(d)}`];
  return(<>
    <div className="pos-head"><div><div className="pos-h-eyebrow">{peptides.length} active</div><div className="pos-title">Stacks</div></div><div className="pos-head-actions"><button className="pos-iconbtn" onClick={onClinic} aria-label="Clinic"><Stethoscope size={18}/></button><button className="pos-iconbtn" onClick={onBrowse} aria-label="Browse protocols"><BookOpen size={18}/></button><button className="pos-iconbtn" onClick={onAdd} aria-label="Add"><Plus size={21}/></button></div></div>
    {clinic&&<ClinicBanner clinic={clinic} onManage={onClinic}/>}
    {peptides.length===0?(<div className="pos-empty"><div className="pos-empty-ic"><Layers size={32}/></div><div className="pos-empty-t">Build your stack</div><div className="pos-empty-s">Start from a ready-made protocol, or add your peptides one by one.</div><button className="pos-cta" onClick={onBrowse} style={{display:"inline-flex",alignItems:"center",gap:8}}><Wand2 size={17}/>Start from a protocol</button><div style={{marginTop:14}}><button onClick={onAdd} style={{background:"none",border:"none",color:"var(--accent)",fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"var(--sans)"}}>or add manually</button></div></div>
    ):peptides.map(p=>{
      const dt=nextDoseAt(p,now,logs),cyc=cycleState(p,now),sup=supplyState(p,logs,now),draw=calcDraw(p.recon);
      const total=Object.keys(logs).filter(k=>k.startsWith(p.id+"__")).length;
      const week=[];for(let i=6;i>=0;i--){const d=addDays(now,-i);week.push({dow:d.getDay(),due:isDue(p,d,logs),hit:taken(p.id,d),today:i===0});}
      let tW=0,duW=0;week.forEach(x=>{if(x.due){duW++;if(x.hit)tW++;}});
      const doseLabel=draw?(draw.doseMg!=null?fmtMg(draw.doseMg):`${draw.units<10?draw.units.toFixed(1):Math.round(draw.units)} units`):p.dose;
      const low=sup&&sup.daysLeft!=null&&sup.daysLeft<10;
      const nextSite=p.rotate!==false?suggestSite(peptideSiteMap(metrics,p.id),now):null;
      const jw=journeyWeek(p,now);
      return(
        <div className="pos-pcard" key={p.id} onClick={()=>onEdit(p)}>
          <div className="pos-pcard-strip" style={{background:p.color}}/>
          <div className="pos-pcard-top"><div className="pos-orb" style={{background:`${p.color}1c`}}><Syringe size={19} color={p.color}/></div>
            <div style={{flex:1,minWidth:0}}><div className="pos-pcard-name">{p.name}</div><div className="pos-pcard-sched">{scheduleLabel(p)}{p.time?` · ${fmtTime(p.time)}`:""}</div></div>
            <div className="pos-pcard-dose">{doseLabel?<><span className="l">DOSE</span>{doseLabel}</>:<ChevronRight size={18} color="var(--ink-3)"/>}</div></div>
          <div className="pos-dots-lbl"><span className="pos-eyebrow">This week</span>{nextSite&&<span style={{fontSize:11,fontWeight:700,color:"var(--ink-3)",display:"inline-flex",alignItems:"center",gap:3}}><MapPin size={11}/>Next: {siteShort(nextSite.id)}</span>}</div>
          <div className="pos-week">{week.map((x,i)=>(<div className="pos-wday" key={i}><span className={`pos-wdot${x.today?" today":""}`} style={{background:x.hit?p.color:x.due?"#f0c4be":"var(--line-2)"}}>{x.hit&&<Check size={13} color="#fff"/>}</span><span className="pos-wlbl">{"SMTWTFS"[x.dow]}</span></div>))}</div>
          {sup&&!sup.unknown&&<div className="pos-supply"><div className="pos-supply-top"><span style={{display:"flex",alignItems:"center",gap:5,color:low?"var(--amber)":"var(--ink-2)"}}><Package size={12}/>{sup.remaining} of {sup.total} doses left</span>{low&&clinic?<a href={clinic.storeUrl} target="_blank" rel="noopener noreferrer" onClick={e=>e.stopPropagation()} style={{display:"flex",alignItems:"center",gap:4,color:"var(--accent)",fontWeight:780,textDecoration:"none"}}>Reorder<ExternalLink size={11}/></a>:<span className="tnum" style={{color:low?"var(--amber)":"var(--ink-2)"}}>{low?"Low · ":""}{sup.daysLeft!=null?(sup.daysLeft>=14?`~${Math.round(sup.daysLeft/7)} wks left`:`~${sup.daysLeft}d left`):""}</span>}</div><div className="pos-bar"><div style={{width:`${sup.total?sup.remaining/sup.total*100:0}%`,background:low?"var(--amber)":p.color}}/></div></div>}
          {cyc&&<div className="pos-cyclebar"><div style={{width:`${cyc.week/cyc.len*100}%`,background:cyc.onPhase?p.color:"var(--ink-3)"}}/></div>}
          <div className="pos-pcard-foot">
            <div className="pos-foot-stat"><span className="pos-eyebrow">Next dose</span><span className="v tnum" style={{color:p.color}}>{dt?fmtGap(dt-now):"—"}</span></div>
            <div className="pos-foot-stat" style={{textAlign:"center"}}><span className="pos-eyebrow">This week</span><span className="v tnum">{duW===0?"—":`${tW}/${duW}`}</span></div>
            {cyc?<div className="pos-foot-stat" style={{textAlign:"right"}}><span className="pos-eyebrow">Cycle</span><span className="v tnum" style={{color:cyc.onPhase?"var(--accent)":"var(--ink-2)"}}>{cyc.onPhase?`On ${cyc.week}/${cyc.len}`:`Off ${cyc.week}/${cyc.len}`}</span></div>:<div className="pos-foot-stat" style={{textAlign:"right"}}><span className="pos-eyebrow">Logged</span><span className="v tnum">{total}</span></div>}
          </div>
          <button className="pos-journey-link" onClick={e=>{e.stopPropagation();onJourney(p);}}>{jw<=0?"What to expect":`What to expect · Week ${jw}`}<ChevronRight size={13}/></button>
        </div>);
    })}
    {peptides.length>0&&<button onClick={onBrowse} style={{width:"100%",border:"1px dashed var(--line-2)",background:"var(--surface-2)",borderRadius:16,padding:"15px",color:"var(--accent)",fontSize:14.5,fontWeight:700,cursor:"pointer",fontFamily:"var(--sans)",display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginTop:2}}><BookOpen size={16}/>Browse protocols</button>}
  </>);
}

/* ---------- TOOLS ---------- */
function Tools({peptides,logs,metrics,now}){
  const[mode,setMode]=useState("calc");
  return(<>
    <div className="pos-head"><div><div className="pos-h-eyebrow">Utilities</div><div className="pos-title">Tools</div></div></div>
    <div className="pos-mini-tabs">
      <button className={mode==="calc"?"active":""} onClick={()=>setMode("calc")}>Draw calculator</button>
      <button className={mode==="backup"?"active":""} onClick={()=>setMode("backup")}>Backup</button>
      <button className={mode==="account"?"active":""} onClick={()=>setMode("account")}>Account</button>
    </div>
    {mode==="calc"&&<ReconCalc/>}
    {mode==="backup"&&<Backup peptides={peptides} logs={logs} metrics={metrics}/>}
    {mode==="account"&&<AccountCard/>}
  </>);
}

function AccountCard(){
  const[email,setEmail]=useState("");
  const[busy,setBusy]=useState(false);
  useEffect(()=>{let on=true;supabase?.auth?.getUser().then(({data})=>{if(on)setEmail(data?.user?.email||"");});return()=>{on=false;};},[]);
  const signOut=async()=>{setBusy(true);try{await supabase.auth.signOut();}catch(_){}};
  return(<div className="pos-tool-card">
    <div className="pos-tool-head"><div className="pos-tool-ic"><ShieldCheck size={20}/></div><div><div className="pos-tool-t">Account</div><div className="pos-tool-s">Your data syncs to this account</div></div></div>
    <div style={{marginTop:14,padding:"12px 13px",border:"1px solid var(--line-2)",borderRadius:12,background:"var(--surface-2)",fontSize:14}}>
      <div style={{fontSize:11.5,fontWeight:650,color:"var(--ink-3)",marginBottom:3}}>Signed in as</div>
      <div style={{fontWeight:680,wordBreak:"break-all"}}>{email||"…"}</div>
    </div>
    <button className="pos-btn" style={{marginTop:14,width:"100%",background:"transparent",border:"1px solid var(--line-2)",color:"var(--ink)"}} disabled={busy} onClick={signOut}>{busy?"Signing out…":"Sign out"}</button>
    <div className="pos-note"><ShieldCheck size={13} style={{flexShrink:0,marginTop:1,color:"var(--accent)"}}/>Your peptides, logs, and progress are stored privately in your account and sync across your devices when you sign in.</div>
  </div>);
}

function ReconCalc(){
  const[mode,setMode]=useState("mix");
  const[vial,setVial]=useState(10),[water,setWater]=useState(2),[conc,setConc]=useState(100),[dose,setDose]=useState(250),[unit,setDUnit]=useState("mcg");
  const d=calcDraw(mode==="premixed"?{mode:"premixed",conc,doseVal:dose,doseUnit:unit}:{mode:"mix",vialMg:vial,waterMl:water,doseVal:dose,doseUnit:unit});
  return(<div className="pos-tool-card">
    <div className="pos-tool-head"><div className="pos-tool-ic"><Calculator size={20}/></div><div><div className="pos-tool-t">Draw calculator</div><div className="pos-tool-s">Exact units to draw for your dose</div></div></div>
    <div className="pos-seg" style={{marginTop:12}}><button className={mode==="mix"?"active":""} onClick={()=>setMode("mix")}>Reconstitute</button><button className={mode==="premixed"?"active":""} onClick={()=>setMode("premixed")}>By concentration</button></div>
    <div style={{marginTop:8}}>
      {mode==="mix"?<>
        <div className="pos-calc-row"><label>Vial strength</label><input className="pos-calc-input" type="number" inputMode="decimal" value={vial} onChange={e=>setVial(parseFloat(e.target.value)||0)}/><span style={{fontSize:13,color:"var(--ink-2)",width:30}}>mg</span></div>
        <div className="pos-calc-row"><label>BAC water added</label><input className="pos-calc-input" type="number" inputMode="decimal" value={water} onChange={e=>setWater(parseFloat(e.target.value)||0)}/><span style={{fontSize:13,color:"var(--ink-2)",width:30}}>mL</span></div>
      </>:<div className="pos-calc-row"><label>Concentration</label><input className="pos-calc-input" type="number" inputMode="decimal" value={conc} onChange={e=>setConc(parseFloat(e.target.value)||0)}/><span style={{fontSize:13,color:"var(--ink-2)",width:46}}>mg/mL</span></div>}
      <div className="pos-calc-row"><label>Your dose</label><input className="pos-calc-input" type="number" inputMode="decimal" value={dose} onChange={e=>setDose(parseFloat(e.target.value)||0)}/><div className="pos-unit" style={{width:"auto"}}><button className={unit==="mcg"?"active":""} onClick={()=>setDUnit("mcg")}>mcg</button><button className={unit==="mg"?"active":""} onClick={()=>setDUnit("mg")}>mg</button></div></div>
    </div>
    <div className="pos-calc-result"><div className="pos-calc-big tnum">{d?(d.units<10?d.units.toFixed(1):Math.round(d.units)):"—"}<span className="u">units</span></div><div className="pos-calc-sub">{d?`${d.mL.toFixed(3)} mL · ${d.conc.toFixed(2)} mg/mL${d.perVial?` · ≈${d.perVial} doses per vial`:""}`:"Enter values above"}</div></div>
    {d&&<div className="pos-syringe"><div className="pos-syr-barrel"><div className="pos-syr-fill" style={{width:`${Math.min(100,d.units)}%`}}/></div><div className="pos-syr-ticks"><span>0</span><span>25</span><span>50</span><span>75</span><span>100</span></div></div>}
    {d?.warn==="over"&&<div className="pos-caut" style={{marginTop:12}}><AlertTriangle size={14} style={{flexShrink:0,marginTop:1}}/>That’s more than a 100-unit (1&nbsp;mL) U-100 syringe holds.{mode==="mix"?" Add more BAC water to lower the concentration, or split the draw.":" Split the draw across more than one injection."}</div>}
    {d?.warn==="tiny"&&<div className="pos-caut" style={{marginTop:12}}><AlertTriangle size={14} style={{flexShrink:0,marginTop:1}}/>Only {d.units.toFixed(1)} units — hard to measure precisely.{mode==="mix"?" Use less BAC water for a more readable draw.":""}</div>}
    <div className="pos-note"><ShieldCheck size={13} style={{flexShrink:0,marginTop:1,color:"var(--accent)"}}/>Math only, on a U-100 insulin syringe (100u = 1&nbsp;mL). Pre-mixed? Just enter the concentration printed on your vial (e.g. 100&nbsp;mg/mL). You set the dose from your protocol or provider — this never recommends one.</div>
  </div>);
}

function SitePicker({open,peptide,metrics,now,onPick,onClose}){
  const[render,setRender]=useState(open),[anim,setAnim]=useState(false);
  useEffect(()=>{if(open){setRender(true);requestAnimationFrame(()=>setAnim(true));}else{setAnim(false);const t=setTimeout(()=>setRender(false),420);return()=>clearTimeout(t);}},[open]);
  if(!render||!peptide)return null;
  const map=peptideSiteMap(metrics,peptide.id);
  const todayKey=`${peptide.id}__${dateKey(now)}`;
  const current=(metrics?.doseSites||{})[todayKey];
  const suggested=suggestSite(map,now);
  const recColor=(id)=>{const r=siteRecency(map,id,now).days;if(r===Infinity)return "var(--line-2)";if(r<=1)return "#dd7a5e";if(r<=3)return "#e0a05e";if(r<=6)return "#cdb86a";return "var(--accent)";};
  return(<>
    <div className={`pos-ov ${anim?"open":""}`} onClick={onClose}/>
    <div className={`pos-sheet ${anim?"open":""}`}>
      <div className="pos-grab"/>
      <div className="pos-snav"><button onClick={onClose}>Close</button><span className="pos-snav-t">Injection site</span><span style={{width:54}}/></div>
      <div className="pos-sbody">
        <div style={{display:"flex",alignItems:"center",gap:10,padding:"2px 4px 6px"}}><span style={{width:11,height:11,borderRadius:3,background:peptide.color}}/><span style={{fontSize:17,fontWeight:740}}>{peptide.name}</span></div>
        <svg viewBox="0 0 100 230" width="150" height="auto" style={{display:"block",margin:"4px auto 0"}}>
          <g fill="var(--surface-2)" stroke="var(--line-2)" strokeWidth="1.5"><circle cx="50" cy="22" r="13"/><rect x="34" y="36" width="32" height="60" rx="13"/><rect x="14" y="40" width="14" height="52" rx="7"/><rect x="72" y="40" width="14" height="52" rx="7"/><rect x="36" y="92" width="28" height="62" rx="12"/><rect x="37" y="150" width="12" height="64" rx="6"/><rect x="51" y="150" width="12" height="64" rx="6"/></g>
          {SITES.map(s=>{const isC=s.id===current,isS=!current&&s.id===suggested.id;return(<g key={s.id} onClick={()=>onPick(s.id)} style={{cursor:"pointer"}}>{(isC||isS)&&<circle cx={s.x} cy={s.y} r="9" fill="none" stroke={peptide.color} strokeWidth="1.5" opacity="0.6"/>}<circle cx={s.x} cy={s.y} r="5.5" fill={isC?peptide.color:recColor(s.id)}/></g>);})}
        </svg>
        <div className="pos-site-suggest"><span className="pos-eyebrow">{current?"Logged at":"Suggested next (least used)"}</span><div className="pos-site-name"><MapPin size={14} color="var(--accent)"/>{current?siteShort(current):suggested.name}</div></div>
        <div className="pos-site-list">{SITES.map(s=>{const r=siteRecency(map,s.id,now);const isC=s.id===current;return(<button key={s.id} className="pos-site-row" onClick={()=>onPick(s.id)}><span className="pos-site-dot" style={{background:isC?peptide.color:recColor(s.id)}}/><span style={{flex:1,textAlign:"left",fontSize:14,fontWeight:isC?760:600,color:isC?peptide.color:"var(--ink)"}}>{s.name}</span>{isC?<Check size={16} color={peptide.color} strokeWidth={3}/>:<span style={{fontSize:12.5,color:"var(--ink-3)"}}>{r.label}</span>}</button>);})}</div>
        <div className="pos-note"><ShieldCheck size={13} style={{flexShrink:0,marginTop:1,color:"var(--accent)"}}/>Picking a site logs this dose there and advances the rotation. The app always suggests the spot you’ve used least recently.</div>
      </div>
    </div>
  </>);
}

function Backup({peptides,logs,metrics}){
  const[copied,setCopied]=useState(false);
  const json=useMemo(()=>JSON.stringify({version:2,exportedAt:new Date().toISOString(),peptides,logs,metrics},null,2),[peptides,logs,metrics]);
  const copy=async()=>{try{await navigator.clipboard.writeText(json);setCopied(true);setTimeout(()=>setCopied(false),1800);}catch(_){}};
  const download=()=>{try{const blob=new Blob([json],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=`peptide-backup-${dateKey(new Date())}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);}catch(_){}};
  return(<div className="pos-tool-card">
    <div className="pos-tool-head"><div className="pos-tool-ic"><Download size={20}/></div><div><div className="pos-tool-t">Backup &amp; export</div><div className="pos-tool-s">A copy of everything in the app</div></div></div>
    <textarea className="pos-backup-area" readOnly value={json}/>
    <div className="pos-btn-row"><button className="pos-btn" onClick={copy}><Copy size={15}/>{copied?"Copied!":"Copy"}</button><button className="pos-btn primary" onClick={download}><Download size={15}/>Download</button></div>
    <div className="pos-note"><ShieldCheck size={13} style={{flexShrink:0,marginTop:1,color:"var(--accent)"}}/>Everything is stored privately in your account and synced to the cloud. A local backup is still handy before big changes.</div>
  </div>);
}

/* ---------- PAIRINGS ---------- */
function Pairings({peptides,ai,loading,error,stale,onRun,onAdd}){
  const result=ai?.result;
  return(<>
    <div className="pos-head"><div><div className="pos-h-eyebrow">AI · powered by Claude</div><div className="pos-title">Pairings</div></div></div>
    {peptides.length===0?(<div className="pos-empty"><div className="pos-empty-ic"><Sparkles size={30}/></div><div className="pos-empty-t">Add a stack first</div><div className="pos-empty-s">Once you’ve added your peptides, AI can surface supplements people commonly pair with them.</div><button className="pos-cta" onClick={onAdd}>Add a peptide</button></div>
    ):(<>
      <div className="pos-ai-hero"><div className="pos-ai-ic"><Sparkles size={26}/></div><h3>{result?"Your pairing analysis":"Analyze your stack"}</h3><p>{result&&!stale?"Educational supplement ideas based on the peptides in your Stacks — not medical advice.":"AI reviews the peptides in your Stacks and surfaces commonly-paired supportive supplements, with cautions to watch."}</p><button className="pos-ai-btn" onClick={onRun} disabled={loading}>{loading?<><span className="pos-spin"/>Analyzing…</>:result?<><RefreshCw size={17}/>Re-analyze stack</>:<><Sparkles size={17}/>Analyze my stack</>}</button></div>
      {error&&<div className="pos-stale" style={{color:"var(--red)",background:"var(--red-soft)",alignItems:"flex-start"}}><AlertTriangle size={15} style={{flexShrink:0,marginTop:1}}/><span><b style={{fontWeight:700}}>Couldn’t generate suggestions.</b><br/><span style={{fontWeight:500,opacity:0.85}}>{error}</span></span></div>}
      {stale&&!loading&&<div className="pos-stale"><RotateCcw size={15}/>Your stack changed since this analysis. Re-analyze to refresh.</div>}
      {loading&&!result&&<><div className="pos-skel"/><div className="pos-skel"/><div className="pos-skel"/></>}
      {result&&<>
        {result.summary&&<div className="pos-sug" style={{background:"var(--surface-2)"}}><div className="pos-sug-why" style={{marginTop:0,color:"var(--ink)"}}>{result.summary}</div></div>}
        <div className="pos-sec"><div className="pos-eyebrow">Suggested pairings</div><div className="pos-sec-count tnum">{result.suggestions.length}</div></div>
        {result.suggestions.map((s,i)=>(<div className="pos-sug" key={i}><div className="pos-sug-top"><span className="pos-sug-name">{s.name}</span>{s.category&&<span className="pos-chip">{s.category}</span>}</div>{s.rationale&&<div className="pos-sug-why">{s.rationale}</div>}<div className="pos-sug-meta">{s.timing&&<span className="pos-sug-tag"><Clock size={12}/>{s.timing}</span>}</div>{s.caution&&<div className="pos-caut"><AlertTriangle size={14} style={{flexShrink:0,marginTop:1}}/>{s.caution}</div>}</div>))}
        {result.interactions&&result.interactions.length>0&&<><div className="pos-sec"><div className="pos-eyebrow">Things to watch</div></div><div className="pos-card">{result.interactions.map((it,i)=>(<div className="pos-watch" key={i}><AlertTriangle size={15} color="var(--amber)" style={{flexShrink:0,marginTop:1}}/>{it}</div>))}</div></>}
      </>}
      <div className="pos-disc"><ShieldCheck size={15} style={{flexShrink:0,marginTop:1,color:"var(--accent)"}}/><span>These are general, educational ideas — not medical advice, and not personalized to your health history. Supplements can interact with medications and conditions. Talk to a doctor or pharmacist before changing anything, especially alongside prescription or investigational compounds.{result?.disclaimer?` ${result.disclaimer}`:""}</span></div>
    </>)}
  </>);
}

/* ---------- INSIGHTS ---------- */
function Insights({peptides,logs,metrics,now,addWeight,setUnit,addRecovery,addLab,deleteLab,onShare}){
  const[view,setView]=useState("trends");
  if(peptides.length===0)return(<>
    <div className="pos-head"><div><div className="pos-h-eyebrow">Analytics</div><div className="pos-title">Insights</div></div></div>
    <div className="pos-empty"><div className="pos-empty-ic"><Activity size={32}/></div><div className="pos-empty-t">No data yet</div><div className="pos-empty-s">Add peptides and start logging. Trends, recovery and labs land here.</div></div>
  </>);
  return(<>
    <div className="pos-head"><div><div className="pos-h-eyebrow">Analytics</div><div className="pos-title">Insights</div></div><button className="pos-iconbtn" onClick={onShare} aria-label="Share"><Share2 size={18}/></button></div>
    <div className="pos-mini-tabs"><button className={view==="trends"?"active":""} onClick={()=>setView("trends")}>Trends</button><button className={view==="recovery"?"active":""} onClick={()=>setView("recovery")}>Recovery</button><button className={view==="labs"?"active":""} onClick={()=>setView("labs")}>Labs</button></div>
    {view==="trends"&&<TrendsView peptides={peptides} logs={logs} metrics={metrics} now={now} addWeight={addWeight} setUnit={setUnit}/>}
    {view==="recovery"&&<RecoveryView metrics={metrics} now={now} addRecovery={addRecovery}/>}
    {view==="labs"&&<LabsView metrics={metrics} addLab={addLab} deleteLab={deleteLab}/>}
  </>);
}

function TrendsView({peptides,logs,metrics,now,addWeight,setUnit}){
  const s=useMemo(()=>fullStats(peptides,logs,now),[peptides,logs,now]);
  const insight=useMemo(()=>smartInsight(peptides,logs,now),[peptides,logs,now]);
  const achievements=useMemo(()=>ACHIEVEMENTS.map(a=>({...a,unlocked:a.test(s)})),[s]);
  const unlockedN=achievements.filter(a=>a.unlocked).length;
  const wEntries=useMemo(()=>Object.entries(metrics.entries||{}).map(([d,v])=>({d,v})).sort((a,b)=>a.d.localeCompare(b.d)),[metrics]);
  const eEntries=useMemo(()=>Object.entries(metrics.energy||{}).map(([d,v])=>({d,v})).sort((a,b)=>a.d.localeCompare(b.d)),[metrics]);
  const[w,setW]=useState("");
  const latest=wEntries.length?wEntries[wEntries.length-1].v:null,first=wEntries.length?wEntries[0].v:null;
  const delta=latest!=null&&first!=null?latest-first:null;
  const submitW=()=>{const v=parseFloat(w);if(v>0){addWeight(v);setW("");}};
  return(<>
    <div className="pos-insight"><div className="pos-insight-ic">{insight.icon==="flame"?<Flame size={17}/>:insight.icon==="clock"?<Clock size={17}/>:<TrendingUp size={17}/>}</div><div className="pos-insight-text"><span className="pos-eyebrow" style={{color:"rgba(255,255,255,0.7)"}}>Smart insight</span><div>{insight.text}</div></div></div>
    <div className="pos-grid2">
      <div className="pos-tile"><div className="pos-tile-top"><Flame size={15} color="#c98a1e"/><span className="pos-eyebrow">Current streak</span></div><div className="pos-tile-val tnum">{s.streak}<span className="u">{s.streak===1?"day":"days"}</span></div></div>
      <div className="pos-tile"><div className="pos-tile-top"><Award size={15} color="var(--accent)"/><span className="pos-eyebrow">Best streak</span></div><div className="pos-tile-val tnum">{s.best}<span className="u">{s.best===1?"day":"days"}</span></div></div>
    </div>
    <div className="pos-sec"><div className="pos-eyebrow">Achievements</div><div className="pos-sec-count tnum">{unlockedN}/{achievements.length}</div></div>
    <div className="pos-ach-grid">{achievements.map(a=>(<div key={a.id} className={`pos-ach ${a.unlocked?"on":""}`}><div className="pos-ach-emoji">{a.unlocked?a.emoji:<Lock size={16} color="var(--ink-3)"/>}</div><div className="pos-ach-name">{a.name}</div><div className="pos-ach-desc">{a.desc}</div></div>))}</div>
    <div className="pos-sec"><div className="pos-eyebrow">Adherence · 30 days</div></div>
    <div className="pos-hero" style={{marginBottom:13}}>
      <div className="pos-ringwrap" style={{width:148,height:148,margin:"0 auto"}}><svg width={148} height={148}><circle cx={74} cy={74} r={66} fill="none" stroke="var(--line-2)" strokeWidth={14}/><circle cx={74} cy={74} r={66} fill="none" stroke="var(--accent)" strokeWidth={14} strokeLinecap="round" strokeDasharray={2*Math.PI*66} strokeDashoffset={2*Math.PI*66*(1-s.adherence)} transform="rotate(-90 74 74)" style={{transition:"stroke-dashoffset .8s cubic-bezier(.4,0,.2,1)"}}/></svg><div className="pos-ring-center"><div className="pos-ring-num tnum" style={{fontSize:40}}>{Math.round(s.adherence*100)}<small style={{fontSize:18}}>%</small></div></div></div>
      <div className="pos-hero-stats"><div className="pos-hstat"><div className="pos-eyebrow">Logged</div><div className="pos-hstat-val tnum">{s.taken30}</div></div><div className="pos-hstat"><div className="pos-eyebrow">Scheduled</div><div className="pos-hstat-val tnum">{s.due30}</div></div><div className="pos-hstat"><div className="pos-eyebrow">All-time</div><div className="pos-hstat-val tnum">{s.total}</div></div></div>
    </div>
    <div className="pos-sec"><div className="pos-eyebrow">Weight</div><div className="pos-unit"><button className={metrics.unit==="lb"?"active":""} onClick={()=>setUnit("lb")}>lb</button><button className={metrics.unit==="kg"?"active":""} onClick={()=>setUnit("kg")}>kg</button></div></div>
    <div className="pos-card">
      <div className="pos-w-head"><div><div className="pos-w-val tnum">{latest!=null?latest:"—"}<span className="u">{metrics.unit}</span></div>{delta!=null&&<div className="pos-w-delta" style={{color:delta<0?"var(--accent)":delta>0?"var(--ink-2)":"var(--ink-3)"}}>{delta<0?"▼":delta>0?"▲":""} {Math.abs(delta).toFixed(1)} {metrics.unit} since start</div>}</div></div>
      {wEntries.length>=2&&<LineChart entries={wEntries}/>}
      <div className="pos-w-add"><input className="pos-w-input" type="number" inputMode="decimal" placeholder={`Log today’s weight (${metrics.unit})`} value={w} onChange={e=>setW(e.target.value)}/><button className="pos-w-btn" onClick={submitW}>Log</button></div>
    </div>
    {eEntries.length>=2&&<><div className="pos-sec"><div className="pos-eyebrow">Energy trend</div></div><div className="pos-card" style={{padding:"14px 6px 10px"}}><EnergyChart entries={eEntries}/></div></>}
    <div className="pos-sec"><div className="pos-eyebrow">Consistency · 12 weeks</div></div>
    <div className="pos-card"><Heatmap peptides={peptides} logs={logs} now={now}/></div>
    <div className="pos-sec"><div className="pos-eyebrow">By peptide · 30 days</div></div>
    <div className="pos-card">{s.per.map(pp=>(<div className="pos-barrow" key={pp.id}><div className="pos-bartop"><div className="pos-barname"><span style={{width:10,height:10,borderRadius:3,background:pp.color,display:"inline-block"}}/>{pp.name}</div><div className="tnum" style={{fontWeight:780,color:pp.color}}>{pp.due?Math.round(pp.pct*100)+"%":"—"}</div></div><div className="pos-bartrack"><div className="pos-barfill" style={{width:`${pp.pct*100}%`,background:pp.color}}/></div></div>))}</div>
  </>);
}

function RecoveryView({metrics,now,addRecovery}){
  const today=(metrics.recovery||{})[dateKey(now)]||{};
  const[note,setNote]=useState(null);
  const fields=[{k:"sleep",l:"Sleep",u:"score"},{k:"hrv",l:"HRV",u:"ms"},{k:"rhr",l:"Resting HR",u:"bpm"}];
  return(<>
    <div className="pos-sec"><div className="pos-eyebrow">Connect a device</div></div>
    <div className="pos-card">{DEVICES.map(dv=>(<div className="pos-device" key={dv.id}><div className="pos-device-ic" style={{background:dv.bg,color:dv.bg==="#1b1e25"?"#fff":"inherit"}}>{dv.emoji}</div><div className="pos-device-name">{dv.name}</div><button className="pos-device-btn" onClick={()=>setNote(dv.id)}>Connect</button></div>))}</div>
    {note&&<div className="pos-stale"><Plug size={15}/>Live sync with {DEVICES.find(d=>d.id===note)?.name} activates in the full PeptideOS app. For now, log key metrics below.</div>}
    <div className="pos-sec"><div className="pos-eyebrow">Today’s recovery</div></div>
    <div className="pos-card">
      <div className="pos-rec-grid">{fields.map(f=>(<div className="pos-rec-cell" key={f.k}><div className="v tnum">{today[f.k]!=null?today[f.k]:"—"}</div><div className="l">{f.l}</div></div>))}</div>
      <div style={{display:"flex",gap:9,padding:"0 14px 16px"}}>{fields.map(f=>(<input key={f.k} className="pos-rec-input" type="number" inputMode="decimal" placeholder={f.l} defaultValue={today[f.k]??""} onBlur={e=>{const v=parseFloat(e.target.value);if(!isNaN(v))addRecovery(f.k,v);}}/>))}</div>
    </div>
    <div className="pos-disc"><HeartPulse size={15} style={{flexShrink:0,marginTop:1,color:"var(--accent)"}}/><span>Recovery, sleep and HRV give your adherence context — see how your body responds over a cycle. Tap a field and enter a value, or connect a wearable in the full app for automatic sync.</span></div>
  </>);
}

function LabsView({metrics,addLab,deleteLab}){
  const labs=metrics.labs||[];
  const[marker,setMarker]=useState(""),[val,setVal]=useState(""),[unit,setUnit]=useState(""),[low,setLow]=useState(""),[high,setHigh]=useState("");
  const add=()=>{const v=parseFloat(val);if(!marker.trim()||isNaN(v))return;addLab({id:"l_"+Date.now().toString(36),marker:marker.trim(),value:v,unit:unit.trim(),date:dateKey(new Date()),low:low?parseFloat(low):null,high:high?parseFloat(high):null});setMarker("");setVal("");setUnit("");setLow("");setHigh("");};
  const byMarker={};labs.forEach(l=>{(byMarker[l.marker]=byMarker[l.marker]||[]).push(l);});
  const groups=Object.entries(byMarker).map(([m,arr])=>({m,arr:arr.slice().sort((a,b)=>a.date.localeCompare(b.date))}));
  return(<>
    <div className="pos-sec"><div className="pos-eyebrow">Add a result</div></div>
    <div className="pos-card"><div className="pos-lab-form">
      <input className="pos-w-input" list="lm" placeholder="Marker (e.g. IGF-1)" value={marker} onChange={e=>setMarker(e.target.value)}/>
      <datalist id="lm">{LAB_MARKERS.map(m=><option key={m} value={m}/>)}</datalist>
      <div className="pos-lab-grid"><input className="pos-w-input" type="number" inputMode="decimal" placeholder="Value" value={val} onChange={e=>setVal(e.target.value)}/><input className="pos-w-input" placeholder="Unit" value={unit} onChange={e=>setUnit(e.target.value)} style={{maxWidth:90}}/></div>
      <div className="pos-lab-grid"><input className="pos-w-input" type="number" inputMode="decimal" placeholder="Range low (optional)" value={low} onChange={e=>setLow(e.target.value)}/><input className="pos-w-input" type="number" inputMode="decimal" placeholder="Range high (optional)" value={high} onChange={e=>setHigh(e.target.value)}/></div>
      <button className="pos-w-btn" style={{width:"100%",marginTop:10,height:44}} onClick={add}>Add result</button>
    </div></div>
    {groups.length===0?<div className="pos-empty" style={{padding:"30px 20px"}}><div className="pos-empty-s">Log your bloodwork to track biomarkers over time and see how your protocol moves them.</div></div>
    :groups.map(g=>{const latest=g.arr[g.arr.length-1];const prev=g.arr.length>1?g.arr[g.arr.length-2]:null;
      const status=latest.low!=null&&latest.value<latest.low?"low":latest.high!=null&&latest.value>latest.high?"high":(latest.low!=null||latest.high!=null)?"in":null;
      const trend=prev?(latest.value>prev.value?"▲":latest.value<prev.value?"▼":"—"):null;
      return(<div className="pos-card" key={g.m} style={{marginBottom:11}}><div className="pos-lab-row">
        <div className="pos-lab-name">{g.m}<div className="d">{latest.date}{trend&&prev?` · ${trend} from ${prev.value}`:""}</div></div>
        {status&&<span className="pos-rng" style={status==="in"?{background:"var(--accent-soft)",color:"var(--accent-ink)"}:{background:"var(--amber-soft)",color:"var(--amber)"}}>{status==="in"?"In range":status}</span>}
        <div className="pos-lab-val">{latest.value}<span style={{fontSize:11,color:"var(--ink-3)",fontWeight:600,marginLeft:3}}>{latest.unit}</span></div>
        <button onClick={()=>deleteLab(latest.id)} style={{background:"none",border:"none",cursor:"pointer",color:"var(--ink-3)",padding:4}}><Trash2 size={15}/></button>
      </div>{g.arr.length>=2&&<LineChart entries={g.arr.map(x=>({d:x.date,v:x.value}))}/>}</div>);})}
    <div className="pos-disc"><FlaskConical size={15} style={{flexShrink:0,marginTop:1,color:"var(--accent)"}}/><span>Track lab values over time to inform conversations with your provider. “In/out of range” reflects only the reference range you enter — it isn’t a diagnosis. Always review results with a clinician.</span></div>
  </>);
}

function LineChart({entries}){
  const W=300,H=72,pd=8;
  const vals=entries.map(e=>e.v),min=Math.min(...vals),max=Math.max(...vals),span=max-min||1;
  const pts=entries.map((e,i)=>{const x=pd+(entries.length===1?0:i/(entries.length-1))*(W-pd*2);const y=pd+(1-(e.v-min)/span)*(H-pd*2);return[x,y];});
  const d=pts.map((p,i)=>`${i?"L":"M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const area=`${d} L ${pts[pts.length-1][0].toFixed(1)} ${H} L ${pts[0][0].toFixed(1)} ${H} Z`;
  return(<div style={{padding:"4px 12px 8px"}}><svg viewBox={`0 0 ${W} ${H}`} width="100%" height="72" preserveAspectRatio="none">
    <defs><linearGradient id="lcg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1c8a74" stopOpacity="0.18"/><stop offset="100%" stopColor="#1c8a74" stopOpacity="0"/></linearGradient></defs>
    <path d={area} fill="url(#lcg)"/><path d={d} fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
    {pts.length<=16&&pts.map((p,i)=>(<circle key={i} cx={p[0]} cy={p[1]} r="2.6" fill="var(--accent)"/>))}
  </svg></div>);
}
function EnergyChart({entries}){
  const recent=entries.slice(-21),colors=["#dd7a5e","#e0a05e","#cdb86a","#5cb89e","#1c8a74"];
  return(<div style={{display:"flex",alignItems:"flex-end",gap:3,height:64,padding:"0 12px"}}>{recent.map((e,i)=>(<div key={i} style={{flex:1,minWidth:0,display:"flex",flexDirection:"column",justifyContent:"flex-end",height:"100%"}}><div style={{height:`${e.v/5*100}%`,background:colors[e.v-1],borderRadius:"3px 3px 1px 1px"}}/></div>))}</div>);
}
function Heatmap({peptides,logs,now}){
  const taken=(id,d)=>!!logs[`${id}__${dateKey(d)}`];
  const weeks=12,start=addDays(now,-(weeks*7-1+now.getDay())),cols=[];
  for(let w=0;w<=weeks;w++){const col=[];for(let dw=0;dw<7;dw++){const d=addDays(start,w*7+dw);if(d>now){col.push(null);continue;}const due=peptides.filter(p=>isDue(p,d,logs));col.push(due.length?due.filter(p=>taken(p.id,d)).length/due.length:-1);}cols.push(col);}
  const c=r=>r===null?"transparent":r<0?"var(--line)":r===0?"#f0c4be":r<0.5?"#aedcc9":r<1?"#5cb89e":"var(--accent)";
  return(<div className="pos-heat">{cols.map((col,i)=>(<div className="pos-heat-col" key={i}>{col.map((r,j)=>(<div className="pos-heat-cell" key={j} style={{background:c(r)}}/>))}</div>))}</div>);
}

/* ---------- SHARE ---------- */
function ShareCard({open,peptides,logs,now,onClose}){
  const[render,setRender]=useState(open),[anim,setAnim]=useState(false);
  useEffect(()=>{if(open){setRender(true);requestAnimationFrame(()=>setAnim(true));}else{setAnim(false);const t=setTimeout(()=>setRender(false),320);return()=>clearTimeout(t);}},[open]);
  if(!render)return null;
  const s=fullStats(peptides,logs,now);
  const starts=peptides.map(p=>parseKey(p.startDate));const earliest=starts.length?new Date(Math.min(...starts)):now;
  const daysTracked=Math.max(1,dayDiff(now,earliest)+1);
  return(<div className={`pos-share-ov ${anim?"open":""}`} onClick={onClose}>
    <button className="pos-share-close" onClick={onClose}><X size={18}/></button>
    <div onClick={e=>e.stopPropagation()} style={{width:"100%",maxWidth:330}}>
      <div className="pos-share-card"><div className="pos-share-brand"><Syringe size={16}/>PEPTIDE OS</div>
        <div className="pos-share-streak tnum">{s.streak}<span> day{s.streak===1?"":"s"}</span></div><div className="pos-share-lbl">current streak 🔥</div>
        <div className="pos-share-grid"><div className="pos-share-stat"><div className="v tnum">{Math.round(s.adherence*100)}%</div><div className="l">30-day adherence</div></div><div className="pos-share-stat"><div className="v tnum">{s.total}</div><div className="l">doses logged</div></div><div className="pos-share-stat"><div className="v tnum">{daysTracked}</div><div className="l">days tracked</div></div></div>
      </div>
      <div className="pos-share-hint">Screenshot to share your progress 📸</div>
    </div>
  </div>);
}

/* ---------- stats ---------- */
function computeStreak(peptides,logs,now){const taken=(id,d)=>!!logs[`${id}__${dateKey(d)}`];let s=0;for(let i=0;i<400;i++){const d=addDays(now,-i);const due=peptides.filter(p=>isDue(p,d,logs));if(due.length===0)continue;if(due.every(p=>taken(p.id,d)))s++;else{if(i===0)continue;else break;}}return s;}
function adherence(peptides,logs,now,n){const taken=(id,d)=>!!logs[`${id}__${dateKey(d)}`];let du=0,t=0;for(let i=0;i<n;i++){const d=addDays(now,-i);peptides.filter(p=>isDue(p,d,logs)).forEach(p=>{du++;if(taken(p.id,d))t++;});}return du?t/du:0;}
function fullStats(peptides,logs,now){
  const taken=(id,d)=>!!logs[`${id}__${dateKey(d)}`];
  const streak=computeStreak(peptides,logs,now);
  let du30=0,t30=0;for(let i=0;i<30;i++){const d=addDays(now,-i);peptides.filter(p=>isDue(p,d,logs)).forEach(p=>{du30++;if(taken(p.id,d))t30++;});}
  const starts=peptides.map(p=>parseKey(p.startDate));const earliest=starts.length?new Date(Math.min(...starts)):now;
  const span=Math.min(730,dayDiff(now,earliest));let run=0,best=streak;
  for(let i=span;i>=0;i--){const d=addDays(now,-i);const due=peptides.filter(p=>isDue(p,d,logs));if(due.length===0)continue;if(due.every(p=>taken(p.id,d)))run++;else{if(i!==0)run=0;}if(run>best)best=run;}
  const per=peptides.map(p=>{let du=0,t=0;for(let i=0;i<30;i++){const d=addDays(now,-i);if(isDue(p,d,logs)){du++;if(taken(p.id,d))t++;}}return{id:p.id,name:p.name,color:p.color,due:du,pct:du?t/du:0};});
  return{streak,best:Math.max(best,streak),due30:du30,taken30:t30,adherence:du30?t30/du30:0,total:Object.keys(logs).length,per};
}

/* ---------- protocol library ---------- */
function ProtocolLibrary({open,clinic,onClose,onApply,peptides}){
  const[render,setRender]=useState(open),[anim,setAnim]=useState(false),[sel,setSel]=useState(null);
  useEffect(()=>{if(open){setRender(true);setSel(null);requestAnimationFrame(()=>setAnim(true));}else{setAnim(false);const t=setTimeout(()=>setRender(false),420);return()=>clearTimeout(t);}},[open]);
  if(!render)return null;
  const have=new Set(peptides.map(p=>p.name.toLowerCase()));
  const clinicProtos=clinic?(clinic.protocols||[]).map(p=>({...p,_clinic:clinic.name})):[];
  const list=[...clinicProtos,...PROTOCOLS];
  return(<>
    <div className={`pos-ov ${anim?"open":""}`} onClick={onClose}/>
    <div className={`pos-sheet ${anim?"open":""}`}>
      <div className="pos-grab"/>
      <div className="pos-snav">
        {sel?<button onClick={()=>setSel(null)} style={{display:"flex",alignItems:"center",gap:3}}><ChevronLeft size={18}/>Protocols</button>:<button onClick={onClose}>Close</button>}
        <span className="pos-snav-t">{sel?"Preview":"Protocols"}</span><span style={{width:54}}/>
      </div>
      <div className="pos-sbody">
        {!sel?<>
          <div className="pos-hint" style={{padding:"2px 6px 12px"}}>Tap a protocol to preview, then add it to your stack. Doses stay blank — you set those with your provider.</div>
          <div className="pos-proto-grid">
            {list.map(pr=>(
              <button key={pr.id} className="pos-proto" onClick={()=>setSel(pr)}>
                <div className="pos-proto-emoji" style={{background:`${pr.accent}1c`}}>{pr.emoji}</div>
                {pr._clinic&&<div className="pos-proto-badge" style={{color:pr.accent}}>{pr._clinic}</div>}
                <div className="pos-proto-name">{pr.name}</div>
                <div className="pos-proto-tag">{pr.tag}</div>
                <div className="pos-proto-count" style={{color:pr.accent}}>{pr.peptides.length} peptide{pr.peptides.length>1?"s":""}</div>
              </button>
            ))}
          </div>
        </>:<>
          <div className="pos-proto-hero" style={{background:`linear-gradient(135deg, ${sel.accent}, ${sel.accent}d0)`}}>
            <div className="pos-proto-hero-emoji">{sel.emoji}</div>
            <div><div style={{fontSize:22,fontWeight:800,letterSpacing:"-0.02em"}}>{sel.name}</div><div style={{fontSize:13.5,opacity:0.92,marginTop:3}}>{sel.tag}</div></div>
          </div>
          <div className="pos-flbl">Includes</div>
          <div className="pos-field">
            {sel.peptides.map((tp,i)=>{const dup=have.has(tp.name.toLowerCase());return(
              <div className="pos-frow" key={i} style={{gap:11}}>
                <span style={{width:11,height:11,borderRadius:3,background:tp.color,flexShrink:0}}/>
                <div style={{flex:1,minWidth:0}}><div style={{fontSize:15.5,fontWeight:700}}>{tp.name}</div><div style={{fontSize:12.5,color:"var(--ink-2)"}}>{scheduleLabel({schedule:tp.schedule})} · {fmtTime(tp.time)}</div></div>
                {dup&&<span className="pos-chip" style={{background:"var(--line)",color:"var(--ink-3)"}}>In stack</span>}
              </div>);})}
          </div>
          <button className="pos-cta" style={{width:"100%",marginTop:18,display:"flex",alignItems:"center",justifyContent:"center",gap:8}} onClick={()=>onApply(sel)}><Plus size={18}/>Add to my stack</button>
          <div className="pos-disc"><ShieldCheck size={15} style={{flexShrink:0,marginTop:1,color:"var(--accent)"}}/><span>A starting structure, not a prescription. Set your own doses and confirm anything you run with a licensed clinician.</span></div>
        </>}
      </div>
    </div>
  </>);
}

/* ---------- clinic / white-label ---------- */
function ClinicBanner({clinic,onManage}){
  return(<div className="pos-clinic-banner" onClick={onManage}>
    <div className="pos-clinic-logo">{clinic.emoji}</div>
    <div style={{flex:1,minWidth:0}}><div className="pos-clinic-name">{clinic.name}</div><div className="pos-clinic-sub">Connected · tap to manage</div></div>
    <ChevronRight size={17} style={{opacity:.6}}/>
  </div>);
}
function ClinicSheet({open,clinic,peptides,onConnect,onDisconnect,onAddProduct,onOpenProvider,onClose}){
  const[render,setRender]=useState(open),[anim,setAnim]=useState(false);
  useEffect(()=>{if(open){setRender(true);requestAnimationFrame(()=>setAnim(true));}else{setAnim(false);const t=setTimeout(()=>setRender(false),420);return()=>clearTimeout(t);}},[open]);
  if(!render)return null;
  const have=new Set(peptides.map(p=>p.name.toLowerCase()));
  return(<>
    <div className={`pos-ov ${anim?"open":""}`} onClick={onClose}/>
    <div className={`pos-sheet ${anim?"open":""}`}>
      <div className="pos-grab"/>
      <div className="pos-snav"><button onClick={onClose}>Close</button><span className="pos-snav-t">{clinic?"Your clinic":"Connect a clinic"}</span><span style={{width:54}}/></div>
      <div className="pos-sbody">
        {!clinic?<>
          <div className="pos-hint" style={{padding:"2px 6px 14px"}}>If your provider uses this app, connect to load their catalog, protocols and branding. (Demo: tap a clinic below.)</div>
          {CLINICS.map(c=>(
            <button key={c.id} className="pos-clinic-card" onClick={()=>onConnect(c.id)} style={{borderColor:`${c.accent}33`}}>
              <div className="pos-clinic-logo" style={{background:`${c.accent}1c`,color:c.accent}}>{c.emoji}</div>
              <div style={{flex:1,textAlign:"left"}}><div className="pos-clinic-name" style={{fontSize:16}}>{c.name}</div><div className="pos-clinic-sub">{c.tagline}</div></div>
              <span className="pos-chip" style={{background:`${c.accent}1c`,color:c.accent}}>Connect</span>
            </button>
          ))}
        </>:<>
          <div className="pos-proto-hero" style={{background:`linear-gradient(135deg, ${clinic.accent}, ${clinic.accent}d0)`}}>
            <div className="pos-proto-hero-emoji">{clinic.emoji}</div>
            <div style={{flex:1}}><div style={{fontSize:21,fontWeight:800,letterSpacing:"-0.02em"}}>{clinic.name}</div><div style={{fontSize:13,opacity:0.92,marginTop:3}}>{clinic.tagline}</div></div>
          </div>
          <a href={clinic.storeUrl} target="_blank" rel="noopener noreferrer" className="pos-btn primary" style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,textDecoration:"none",marginTop:14}}><ExternalLink size={15}/>Shop &amp; reorder</a>
          <button className="pos-btn" style={{width:"100%",marginTop:10,display:"flex",alignItems:"center",justifyContent:"center",gap:8}} onClick={onOpenProvider}><Building2 size={15}/>Open provider view (preview)</button>
          <div className="pos-flbl">Catalog · tap to add</div>
          <div className="pos-field">
            {clinic.catalog.map((prod,i)=>{const added=have.has(prod.name.toLowerCase());return(
              <div className="pos-frow" key={i} style={{gap:11}}>
                <span style={{width:11,height:11,borderRadius:3,background:prod.color,flexShrink:0}}/>
                <div style={{flex:1,minWidth:0}}><div style={{fontSize:15,fontWeight:700}}>{prod.name}</div><div style={{fontSize:12,color:"var(--ink-2)"}}>{prod.blurb}</div></div>
                {added?<span className="pos-chip" style={{background:"var(--line)",color:"var(--ink-3)"}}>Added</span>:<button className="pos-mini-add" onClick={()=>onAddProduct(prod)}><Plus size={16}/></button>}
              </div>);})}
          </div>
          <div className="pos-note"><ShieldCheck size={13} style={{flexShrink:0,marginTop:1,color:"var(--accent)"}}/>Adding a product sets it up as a pre-mixed vial — just enter the units your provider prescribed. The app never recommends a dose.</div>
          <button className="pos-del" onClick={onDisconnect}>Disconnect clinic</button>
        </>}
      </div>
    </div>
  </>);
}

/* ---------- provider dashboard (B2B preview) ---------- */
function ProviderDashboard({open,clinic,peptides,logs,now,onClose}){
  const[render,setRender]=useState(open),[anim,setAnim]=useState(false),[sel,setSel]=useState(null);
  useEffect(()=>{if(open){setRender(true);setSel(null);requestAnimationFrame(()=>setAnim(true));}else{setAnim(false);const t=setTimeout(()=>setRender(false),420);return()=>clearTimeout(t);}},[open]);
  if(!render)return null;
  const me=(()=>{
    if(!peptides.length)return null;
    const s=fullStats(peptides,logs,now);
    const ts=Object.values(logs).map(v=>new Date(v).getTime()).filter(Boolean);
    const last=ts.length?fmtGap(now-Math.max(...ts))+" ago":"—";
    const proto=peptides.length===1?peptides[0].name:`${peptides.length} peptides`;
    return{name:"You",init:"YOU",proto,adh:s.adherence,streak:s.streak,last,per:s.per.map(p=>({name:p.name,color:p.color,pct:p.pct})),_you:true};
  })();
  const roster=[...(me?[me]:[]),...PATIENTS];
  const others=roster.filter(p=>!p._you).sort((a,b)=>a.adh-b.adh);
  const ordered=[...(me?[me]:[]),...others];
  const avg=roster.length?roster.reduce((a,p)=>a+p.adh,0)/roster.length:0;
  const atRisk=roster.filter(p=>p.adh<0.6).length;
  const brand=clinic||{name:"Your clinic",accent:"#1c8a74",emoji:"🩺"};
  return(<>
    <div className={`pos-ov ${anim?"open":""}`} onClick={onClose}/>
    <div className={`pos-sheet ${anim?"open":""}`}>
      <div className="pos-grab"/>
      <div className="pos-snav">
        {sel?<button onClick={()=>setSel(null)} style={{display:"flex",alignItems:"center",gap:3}}><ChevronLeft size={18}/>Roster</button>:<button onClick={onClose}>Close</button>}
        <span className="pos-snav-t">{sel?sel.name:"Provider view"}</span><span style={{width:54}}/>
      </div>
      <div className="pos-sbody">
        {!sel?<>
          <div className="pos-prov-hero" style={{background:`linear-gradient(135deg, ${brand.accent}, ${brand.accent}d0)`}}>
            <div style={{fontSize:12,fontWeight:700,opacity:0.9,letterSpacing:"0.04em",textTransform:"uppercase"}}>{brand.name}</div>
            <div style={{fontSize:21,fontWeight:800,marginTop:3}}>Patient adherence</div>
            <div style={{display:"flex",gap:18,marginTop:16}}>
              <div><div style={{fontSize:24,fontWeight:850}} className="tnum">{roster.length}</div><div style={{fontSize:11,opacity:0.85,fontWeight:600}}>patients</div></div>
              <div><div style={{fontSize:24,fontWeight:850}} className="tnum">{Math.round(avg*100)}%</div><div style={{fontSize:11,opacity:0.85,fontWeight:600}}>avg adherence</div></div>
              <div><div style={{fontSize:24,fontWeight:850}} className="tnum">{atRisk}</div><div style={{fontSize:11,opacity:0.85,fontWeight:600}}>at risk</div></div>
            </div>
          </div>
          <div className="pos-sec"><div className="pos-eyebrow">Roster · needs attention first</div></div>
          {ordered.map((p,i)=>{const st=patientStatus(p.adh);return(
            <button key={i} className="pos-patient" onClick={()=>setSel(p)}>
              <div className="pos-avatar" style={{background:p._you?`${brand.accent}1c`:"var(--surface-2)",color:p._you?brand.accent:"var(--ink-2)"}}>{p.init}</div>
              <div style={{flex:1,minWidth:0,textAlign:"left"}}><div style={{fontSize:15,fontWeight:740}}>{p.name}{p._you&&<span style={{fontSize:11,color:"var(--ink-3)",fontWeight:600}}> · you</span>}</div><div style={{fontSize:12,color:"var(--ink-2)"}}>{p.proto} · last {p.last}</div></div>
              <div style={{textAlign:"right"}}><div className="tnum" style={{fontSize:16,fontWeight:800,color:st.color}}>{Math.round(p.adh*100)}%</div><span className="pos-rng" style={{background:st.bg,color:st.color}}>{st.label}</span></div>
            </button>);})}
          <div className="pos-disc"><Building2 size={15} style={{flexShrink:0,marginTop:1,color:"var(--accent)"}}/><span>Preview of the clinician web view. In production this is a separate, access-controlled dashboard; patients appear only with consent, and it shows adherence — never a tool to set doses.</span></div>
        </>:<>
          <div style={{display:"flex",alignItems:"center",gap:13,padding:"6px 4px 14px"}}>
            <div className="pos-avatar" style={{width:48,height:48,fontSize:15,background:`${brand.accent}1c`,color:brand.accent}}>{sel.init}</div>
            <div><div style={{fontSize:19,fontWeight:780}}>{sel.name}</div><div style={{fontSize:13,color:"var(--ink-2)"}}>{sel.proto}</div></div>
          </div>
          <div className="pos-grid2">
            <div className="pos-tile"><div className="pos-tile-top"><TrendingUp size={15} color="var(--accent)"/><span className="pos-eyebrow">30-day adherence</span></div><div className="pos-tile-val tnum">{Math.round(sel.adh*100)}<span className="u">%</span></div></div>
            <div className="pos-tile"><div className="pos-tile-top"><Flame size={15} color="#c98a1e"/><span className="pos-eyebrow">Streak</span></div><div className="pos-tile-val tnum">{sel.streak}<span className="u">d</span></div></div>
          </div>
          <div className="pos-sec"><div className="pos-eyebrow">By peptide</div><div className="pos-sec-count">last dose {sel.last}</div></div>
          <div className="pos-card">{sel.per.map((pp,i)=>(<div className="pos-barrow" key={i}><div className="pos-bartop"><div className="pos-barname"><span style={{width:10,height:10,borderRadius:3,background:pp.color,display:"inline-block"}}/>{pp.name}</div><div className="tnum" style={{fontWeight:780,color:pp.color}}>{Math.round(pp.pct*100)}%</div></div><div className="pos-bartrack"><div className="pos-barfill" style={{width:`${pp.pct*100}%`,background:pp.color}}/></div></div>))}</div>
          {sel.adh<0.6&&<div className="pos-caut" style={{marginTop:4}}><AlertTriangle size={14} style={{flexShrink:0,marginTop:1}}/>Adherence below 60% — a check-in may help before this patient drops off protocol.</div>}
        </>}
      </div>
    </div>
  </>);
}

/* ---------- edit dose history (back-log) ---------- */
function HistorySheet({open,peptide,logs,now,onToggle,onClose}){
  const[render,setRender]=useState(open),[anim,setAnim]=useState(false);
  const[month,setMonth]=useState(()=>new Date(now.getFullYear(),now.getMonth(),1));
  useEffect(()=>{if(open){setRender(true);requestAnimationFrame(()=>setAnim(true));setMonth(new Date(now.getFullYear(),now.getMonth(),1));}else{setAnim(false);const t=setTimeout(()=>setRender(false),420);return()=>clearTimeout(t);}},[open]);
  if(!render||!peptide)return null;
  const y=month.getFullYear(),m=month.getMonth();
  const startDow=new Date(y,m,1).getDay(), daysInMonth=new Date(y,m+1,0).getDate();
  const cells=[]; for(let i=0;i<startDow;i++)cells.push(null); for(let d=1;d<=daysInMonth;d++)cells.push(d);
  const todayK=dateKey(now);
  const monthLabel=month.toLocaleDateString(undefined,{month:"long",year:"numeric"});
  const atCurrentMonth=y===now.getFullYear()&&m===now.getMonth();
  const monthPrefix=`${peptide.id}__${y}-${pad(m+1)}`;
  const loggedThisMonth=Object.keys(logs).filter(k=>k.startsWith(monthPrefix)).length;
  const totalLogged=Object.keys(logs).filter(k=>k.startsWith(peptide.id+"__")).length;
  const shiftMonth=(delta)=>setMonth(new Date(y,m+delta,1));
  return(<>
    <div className={`pos-ov ${anim?"open":""}`} onClick={onClose}/>
    <div className={`pos-sheet ${anim?"open":""}`}>
      <div className="pos-grab"/>
      <div className="pos-snav"><button onClick={onClose}>Done</button><span className="pos-snav-t">Log past doses</span><span style={{width:54}}/></div>
      <div className="pos-sbody">
        <div className="pos-proto-hero" style={{background:`linear-gradient(135deg, ${peptide.color}, ${peptide.color}cc)`}}>
          <div className="pos-proto-hero-emoji"><CalendarDays size={24}/></div>
          <div style={{flex:1}}><div style={{fontSize:20,fontWeight:800,letterSpacing:"-0.02em"}}>{peptide.name}</div><div style={{fontSize:13,opacity:0.92,marginTop:3}}>{totalLogged} {totalLogged===1?"dose":"doses"} logged so far</div></div>
        </div>
        <div className="pos-hint" style={{margin:"12px 2px 14px"}}>Tap any day you actually injected {peptide.name}. Tap again to undo. This fills in your history so streaks and supply stay accurate.</div>
        <div className="pos-cal-nav">
          <button onClick={()=>shiftMonth(-1)} aria-label="Previous month"><ChevronLeft size={20}/></button>
          <span>{monthLabel}</span>
          <button onClick={()=>!atCurrentMonth&&shiftMonth(1)} disabled={atCurrentMonth} aria-label="Next month"><ChevronRight size={20}/></button>
        </div>
        <div className="pos-cal-dow">{["S","M","T","W","T","F","S"].map((d,i)=><span key={i}>{d}</span>)}</div>
        <div className="pos-cal-grid">
          {cells.map((d,i)=>{
            if(d==null)return <span key={i}/>;
            const dk=`${y}-${pad(m+1)}-${pad(d)}`;
            const isTaken=!!logs[`${peptide.id}__${dk}`];
            const future=dk>todayK;
            const isToday=dk===todayK;
            return <button key={i} className={`pos-cal-day${isTaken?" taken":""}${isToday?" today":""}`} disabled={future} onClick={()=>onToggle(peptide.id,dk)} style={isTaken?{background:peptide.color,borderColor:peptide.color}:{}}>{isTaken?<Check size={15} color="#fff"/>:d}</button>;
          })}
        </div>
        <div className="pos-cal-foot">{loggedThisMonth} logged in {monthLabel}</div>
      </div>
    </div>
  </>);
}

/* ---------- what-to-expect journey ---------- */
function JourneySheet({open,peptide,now,onClose}){
  const[render,setRender]=useState(open),[anim,setAnim]=useState(false);
  useEffect(()=>{if(open){setRender(true);requestAnimationFrame(()=>setAnim(true));}else{setAnim(false);const t=setTimeout(()=>setRender(false),420);return()=>clearTimeout(t);}},[open]);
  if(!render||!peptide)return null;
  const wk=journeyWeek(peptide,now);
  const key=peptide.name.trim().toLowerCase();
  const exp=EXPECT[key];
  const note=exp?exp.note:PEPTIDE_NOTES[key];
  const phases=exp?exp.phases:JOURNEY;
  const ev=exp?EV[exp.ev]:null;
  const evColor=ev?(ev.lvl===3?"var(--accent)":ev.lvl===2?"#3f7cc4":"#9a6a12"):"var(--ink-3)";
  const evBg=ev?(ev.lvl===3?"var(--accent-soft)":ev.lvl===2?"#eaf1fb":"var(--amber-soft)"):"var(--surface-2)";
  const cyc=cycleState(peptide,now);
  return(<>
    <div className={`pos-ov ${anim?"open":""}`} onClick={onClose}/>
    <div className={`pos-sheet ${anim?"open":""}`}>
      <div className="pos-grab"/>
      <div className="pos-snav"><button onClick={onClose}>Close</button><span className="pos-snav-t">What to expect</span><span style={{width:54}}/></div>
      <div className="pos-sbody">
        <div className="pos-proto-hero" style={{background:`linear-gradient(135deg, ${peptide.color}, ${peptide.color}cc)`}}>
          <div className="pos-proto-hero-emoji"><Syringe size={26}/></div>
          <div style={{flex:1}}><div style={{fontSize:21,fontWeight:800,letterSpacing:"-0.02em"}}>{peptide.name}</div><div style={{fontSize:13,opacity:0.92,marginTop:3}}>{wk<=0?"Starts soon":`You’re in week ${wk}${cyc?` · ${cyc.onPhase?"on":"off"}-cycle`:""}`}</div></div>
        </div>
        {ev&&<div style={{display:"flex",alignItems:"center",gap:7,marginTop:13}}><span style={{fontSize:11,fontWeight:800,letterSpacing:"0.03em",textTransform:"uppercase",color:evColor,background:evBg,padding:"5px 10px",borderRadius:8}}>{ev.lvl===3?<CheckCheck size={12} style={{verticalAlign:"-2px",marginRight:4}}/>:ev.lvl===1?<AlertTriangle size={11} style={{verticalAlign:"-1px",marginRight:4}}/>:null}{ev.label}</span></div>}
        {exp&&<div style={{fontSize:14,color:"var(--ink-2)",lineHeight:1.55,marginTop:12}}>{exp.over}</div>}
        {!exp&&note&&<div className="pos-card" style={{padding:"14px 16px",marginTop:14}}><div className="pos-eyebrow" style={{marginBottom:6}}>About {peptide.name}</div><div style={{fontSize:13.5,color:"var(--ink-2)",lineHeight:1.5}}>{note}</div></div>}
        <div className="pos-flbl">{exp?"What people tend to experience":"The journey"}</div>
        <div className="pos-jrny">
          {phases.map((ph,i)=>{const active=wk>=ph.s&&wk<=ph.e;const done=wk>ph.e;return(
            <div className={`pos-jrny-row ${active?"active":""}`} key={i}>
              <div className="pos-jrny-rail"><span className="pos-jrny-dot" style={active?{background:peptide.color,borderColor:peptide.color}:done?{background:"var(--ink-3)",borderColor:"var(--ink-3)"}:{}}/>{i<phases.length-1&&<span className="pos-jrny-line"/>}</div>
              <div className="pos-jrny-body">
                <div className="pos-jrny-top"><span className="pos-jrny-label" style={active?{color:peptide.color}:{}}>{ph.label}</span>{active&&<span className="pos-pill" style={{background:`${peptide.color}1c`,color:peptide.color}}>You’re here</span>}</div>
                <div className="pos-jrny-title">{ph.title}</div>
                <div className="pos-jrny-text">{ph.body}</div>
              </div>
            </div>);})}
        </div>
        {exp&&note&&<div className="pos-card" style={{padding:"13px 15px",marginTop:4}}><div style={{display:"flex",gap:9}}><Sparkles size={15} style={{flexShrink:0,marginTop:1,color:peptide.color}}/><div style={{fontSize:13,color:"var(--ink-2)",lineHeight:1.5}}>{note}</div></div></div>}
        <div className="pos-disc"><ShieldCheck size={15} style={{flexShrink:0,marginTop:1,color:"var(--accent)"}}/><span>General educational information — not medical advice or a promise of results. Timelines come from clinical data where it exists and from common user reports otherwise; many peptides have limited human evidence, and everyone responds differently. Review your plan with your clinician.</span></div>
      </div>
    </div>
  </>);
}

/* ---------- edit sheet ---------- */
function EditSheet({open,peptide,onClose,onSave,onDelete,onHistory}){
  const isNew=!peptide;
  const[name,setName]=useState(peptide?.name||"");
  const[dose,setDose]=useState(peptide?.dose||"");
  const[type,setType]=useState(peptide?.schedule?.type||"daily");
  const[n,setN]=useState(peptide?.schedule?.n||2);
  const[days,setDays]=useState(peptide?.schedule?.days||[new Date().getDay()]);
  const[time,setTime]=useState(peptide?.time||"");
  const[color,setColor]=useState(peptide?.color||PALETTE[0].hex);
  const[startDate,setStartDate]=useState(peptide?.startDate||dateKey(new Date()));
  const[cycleOn,setCycleOn]=useState(!!peptide?.cycle);
  const[onW,setOnW]=useState(peptide?.cycle?.on||8);
  const[offW,setOffW]=useState(peptide?.cycle?.off||4);
  const[supplyOn,setSupplyOn]=useState(!!peptide?.supply);
  const[supplyVials,setSupplyVials]=useState(peptide?.supply?.vials||1);
  const[supplyVialMl,setSupplyVialMl]=useState(peptide?.supply?.vialMl||"");
  const[reconOn,setReconOn]=useState(!!peptide?.recon);
  const[rMode,setRMode]=useState(peptide?.recon?.mode==="mix"?"mix":"units");
  const[rUnits,setRUnits]=useState(peptide?.recon?.units||"");
  const[rConc,setRConc]=useState(peptide?.recon?.conc||"");
  const[rVial,setRVial]=useState(peptide?.recon?.vialMg||"");
  const[rWater,setRWater]=useState(peptide?.recon?.waterMl||"");
  const[rDose,setRDose]=useState(peptide?.recon?.doseVal||"");
  const[rUnit,setRUnit]=useState(peptide?.recon?.doseUnit||"mcg");
  const[rotate,setRotate]=useState(peptide?peptide.rotate!==false:true);
  const fileRef=useRef(null);
  const[scanning,setScanning]=useState(false),[scanMsg,setScanMsg]=useState(null);
  const[render,setRender]=useState(open),[anim,setAnim]=useState(false);
  useEffect(()=>{if(open){setRender(true);requestAnimationFrame(()=>setAnim(true));}else{setAnim(false);const t=setTimeout(()=>setRender(false),420);return()=>clearTimeout(t);}},[open]);
  if(!render)return null;
  const toggleDay=i=>setDays(p=>p.includes(i)?p.filter(x=>x!==i):[...p,i]);
  const canSave=name.trim()&&(type!=="weekly"||days.length>0);
  const reconObj=reconOn?(rMode==="mix"?{mode:"mix",vialMg:parseFloat(rVial)||0,waterMl:parseFloat(rWater)||0,doseVal:parseFloat(rDose)||0,doseUnit:rUnit}:{mode:"units",units:parseFloat(rUnits)||0,conc:parseFloat(rConc)||0}):null;
  const drawPrev=calcDraw(reconObj);
  const reconValid=reconOn&&(rMode==="mix"?(parseFloat(rVial)>0&&parseFloat(rWater)>0):(parseFloat(rUnits)>0));
  const computedDose=reconValid&&drawPrev?(drawPrev.doseMg!=null?fmtMg(drawPrev.doseMg):`${drawPrev.units<10?drawPrev.units.toFixed(1):Math.round(drawPrev.units)} units`):null;
  const liquid=rMode!=="mix"; // pre-mixed needs a vial size to count supply
  const supVialMl=parseFloat(supplyVialMl)||0;
  const perVialPrev=reconValid?dosesInVial(reconObj,supVialMl):null;
  const supTotal=perVialPrev!=null?perVialPrev*(parseInt(supplyVials)||0):null;
  const supDays=supTotal!=null&&dosesPerDay({schedule:type==="daily"?{type:"daily"}:type==="everyN"?{type:"everyN",n}:{type:"weekly",days}})>0?Math.round(supTotal/dosesPerDay({schedule:type==="daily"?{type:"daily"}:type==="everyN"?{type:"everyN",n}:{type:"weekly",days}})):null;
  const handleSave=()=>{
    let supply=undefined;
    if(supplyOn){supply={vials:parseInt(supplyVials)||0,vialMl:liquid?(parseFloat(supplyVialMl)||0):undefined};}
    const recon=reconValid?reconObj:undefined;
    onSave({id:peptide?.id||("p_"+Date.now().toString(36)),name:name.trim(),dose:(computedDose||dose.trim()),color,time,startDate,rotate,cycle:cycleOn?{on:onW,off:offW}:undefined,supply,recon,schedule:type==="daily"?{type:"daily"}:type==="everyN"?{type:"everyN",n}:{type:"weekly",days:days.slice().sort((a,b)=>a-b)}});
  };
  const onScanFile=async(e)=>{
    const file=e.target.files&&e.target.files[0]; if(!file)return;
    setScanMsg(null); setScanning(true);
    try{
      const b64=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(String(r.result).split(",")[1]);r.onerror=()=>rej(new Error("Couldn’t read that image."));r.readAsDataURL(file);});
      const media=/^image\/(jpeg|png|gif|webp)$/.test(file.type||"")?file.type:"image/jpeg";
      const resp=await fetch(`${import.meta.env.VITE_API_BASE || ""}/api/anthropic`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        model:"claude-sonnet-4-6",max_tokens:400,
        system:"You read a peptide vial label or a prescription label and extract only what is clearly printed. Never guess or infer a value that is not visible. Reply with MINIFIED JSON ONLY — no markdown, no commentary.",
        messages:[{role:"user",content:[
          {type:"image",source:{type:"base64",media_type:media,data:b64}},
          {type:"text",text:'Extract into this exact JSON shape, using null whenever a value is not clearly shown: {"name":string|null,"concentrationMgMl":number|null,"vialSizeMl":number|null,"units":number|null,"doseValue":number|null,"doseUnit":"mg"|"mcg"|null,"time":"HH:MM"|null,"frequency":"daily"|"weekly"|"everyN"|null}. Set "units" only if an instruction such as "draw 20 units" is printed. "time" must be 24-hour.'}
        ]}]
      })});
      let data=null; try{data=await resp.json();}catch(_){}
      if(!resp.ok||!data||data.type==="error")throw new Error((data&&data.error&&data.error.message)||`Scan failed (HTTP ${resp.status}).`);
      const text=(Array.isArray(data.content)?data.content:[]).filter(b=>b&&b.type==="text").map(b=>b.text).join("\n");
      const clean=text.replace(/```json|```/g,"").trim(); const st=clean.indexOf("{"),en=clean.lastIndexOf("}");
      if(st===-1||en===-1)throw new Error("Couldn’t read the label clearly.");
      const p=JSON.parse(clean.slice(st,en+1));
      const applied=[];
      if(p.name){setName(String(p.name).slice(0,40));applied.push("name");}
      if(p.time&&/^\d{1,2}:\d{2}$/.test(p.time)){const[h,m]=p.time.split(":");setTime(`${String(h).padStart(2,"0")}:${m}`);applied.push("time");}
      if(p.frequency==="daily"){setType("daily");applied.push("schedule");}
      else if(p.frequency==="weekly"){setType("weekly");applied.push("schedule");}
      else if(p.frequency==="everyN"){setType("everyN");applied.push("schedule");}
      const conc=Number(p.concentrationMgMl)||0;
      if(Number(p.units)>0){setReconOn(true);setRMode("units");setRUnits(String(p.units));if(conc>0)setRConc(String(conc));applied.push("dose");}
      else if(conc>0&&Number(p.doseValue)>0){const dm=p.doseUnit==="mcg"?p.doseValue/1000:p.doseValue;const u=Math.round((dm/conc)*1000)/10;if(u>0){setReconOn(true);setRMode("units");setRUnits(String(u));setRConc(String(conc));applied.push("dose");}}
      if(Number(p.vialSizeMl)>0){setSupplyOn(true);setSupplyVialMl(String(p.vialSizeMl));applied.push("vial size");}
      setScanMsg(applied.length?{ok:true,text:`Pre-filled ${applied.join(", ")}. Double-check everything below, then Save.`}:{ok:false,text:"Couldn’t make out clear details — please enter them manually below."});
    }catch(err){setScanMsg({ok:false,text:(err&&err.message)?String(err.message):"Couldn’t scan that photo. You can enter the details manually."});}
    finally{setScanning(false); if(fileRef.current)fileRef.current.value="";}
  };
  return(<>
    <div className={`pos-ov ${anim?"open":""}`} onClick={onClose}/>
    <div className={`pos-sheet ${anim?"open":""}`}>
      <div className="pos-grab"/>
      <div className="pos-snav"><button onClick={onClose}>Cancel</button><span className="pos-snav-t">{isNew?"New Peptide":"Edit"}</span><button className="save" disabled={!canSave} onClick={handleSave}>Save</button></div>
      <div className="pos-sbody">
        <button className="pos-scan-btn" onClick={()=>fileRef.current&&fileRef.current.click()} disabled={scanning}>{scanning?<><span className="pos-scan-spin"/>Reading photo…</>:<><Camera size={17}/>Scan vial or prescription</>}</button>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={onScanFile}/>
        {scanMsg&&<div className="pos-scan-msg" style={{color:scanMsg.ok?"var(--accent-ink)":"#9a6a12",background:scanMsg.ok?"var(--accent-soft)":"var(--amber-soft)"}}>{scanMsg.ok?<Check size={14} style={{flexShrink:0,marginTop:1}}/>:<AlertTriangle size={14} style={{flexShrink:0,marginTop:1}}/>}<span>{scanMsg.text}</span></div>}
        {!scanMsg&&<div className="pos-scan-hint">Snap your EverAge vial or Rx label and the app fills in what it can read — you confirm before saving. Or just enter everything by hand below.</div>}
        <div className="pos-field">
          <div className="pos-frow"><label>Name</label><input className="pos-input" list="sg" value={name} placeholder="e.g. BPC-157" onChange={e=>setName(e.target.value)} autoFocus={isNew}/><datalist id="sg">{SUGGESTIONS.map(s=><option key={s} value={s}/>)}</datalist></div>
          <div className="pos-frow"><label>Dose</label>{computedDose?<div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"flex-end",gap:8}}><span style={{fontSize:16,color:"var(--ink)"}}>{computedDose}</span><span style={{fontSize:9.5,fontWeight:800,letterSpacing:"0.04em",color:"var(--accent)",background:"var(--accent-soft)",padding:"3px 7px",borderRadius:6}}>AUTO</span></div>:<input className="pos-input" value={dose} placeholder="e.g. 250 mcg" onChange={e=>setDose(e.target.value)}/>}</div>
          <div className="pos-frow"><label>Time</label><input className="pos-input" type="time" value={time} onChange={e=>setTime(e.target.value)} style={{color:time?"var(--ink)":"var(--ink-3)"}}/></div>
        </div>
        <div className="pos-flbl">Frequency</div>
        <div className="pos-field" style={{padding:"12px 13px"}}>
          <div className="pos-seg"><button className={type==="daily"?"active":""} onClick={()=>setType("daily")}>Daily</button><button className={type==="everyN"?"active":""} onClick={()=>setType("everyN")}>Every N</button><button className={type==="weekly"?"active":""} onClick={()=>setType("weekly")}>Weekly</button></div>
          {type==="everyN"&&<div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:15}}><span style={{fontSize:16}}>Every</span><div className="pos-step"><button disabled={n<=2} onClick={()=>setN(x=>Math.max(2,x-1))}>−</button><span className="tnum">{n}</span><button disabled={n>=30} onClick={()=>setN(x=>Math.min(30,x+1))}>+</button></div><span style={{fontSize:16,color:"var(--ink-2)"}}>days</span></div>}
          {type==="weekly"&&<div className="pos-days" style={{marginTop:15}}>{DOW1.map((d,i)=>(<button key={i} className="pos-day" style={days.includes(i)?{background:color,color:"#fff",borderColor:color}:{}} onClick={()=>toggleDay(i)}>{d}</button>))}</div>}
        </div>
        <div className="pos-flbl">Dose to draw</div>
        <div className="pos-field">
          <div className="pos-frow"><label style={{flex:1,display:"flex",alignItems:"center",gap:9,width:"auto"}}><Syringe size={16} color="var(--ink-2)"/>Track draw amount</label><button className={`pos-toggle ${reconOn?"on":""}`} onClick={()=>setReconOn(v=>!v)}/></div>
          {reconOn&&<>
            <div style={{padding:"6px 14px 12px"}}>
              <div className="pos-seg"><button className={rMode!=="mix"?"active":""} onClick={()=>setRMode("units")}>Pre-mixed vial</button><button className={rMode==="mix"?"active":""} onClick={()=>setRMode("mix")}>Powder vial</button></div>
              <div style={{fontSize:11.5,color:"var(--ink-3)",lineHeight:1.4,marginTop:8}}>{rMode==="mix"?"You reconstitute it with BAC water yourself — enter the numbers and it works out the units.":"Ready to inject — just enter the number of units your prescription says to draw."}</div>
            </div>
            {rMode==="mix"?<>
              <div className="pos-frow" style={{borderTop:"1px solid var(--line)"}}><label>Vial</label><input className="pos-input" type="number" inputMode="decimal" placeholder="mg" value={rVial} onChange={e=>setRVial(e.target.value)}/><span style={{color:"var(--ink-3)",fontSize:14}}>mg</span></div>
              <div className="pos-frow"><label>BAC water</label><input className="pos-input" type="number" inputMode="decimal" placeholder="mL" value={rWater} onChange={e=>setRWater(e.target.value)}/><span style={{color:"var(--ink-3)",fontSize:14}}>mL</span></div>
              <div className="pos-frow"><label>Dose</label><input className="pos-input" type="number" inputMode="decimal" placeholder="amount" value={rDose} onChange={e=>setRDose(e.target.value)}/><div className="pos-unit" style={{width:"auto"}}><button className={rUnit==="mcg"?"active":""} onClick={()=>setRUnit("mcg")}>mcg</button><button className={rUnit==="mg"?"active":""} onClick={()=>setRUnit("mg")}>mg</button></div></div>
            </>:<>
              <div className="pos-frow" style={{borderTop:"1px solid var(--line)"}}><label>Units to draw</label><input className="pos-input" type="number" inputMode="decimal" placeholder="e.g. 20" value={rUnits} onChange={e=>setRUnits(e.target.value)}/><span style={{color:"var(--ink-3)",fontSize:14}}>units</span></div>
              <div className="pos-frow"><label style={{width:120}}>Vial strength</label><input className="pos-input" type="number" inputMode="decimal" placeholder="optional" value={rConc} onChange={e=>setRConc(e.target.value)}/><span style={{color:"var(--ink-3)",fontSize:14}}>mg/mL</span></div>
            </>}
          </>}
        </div>
        {reconOn&&drawPrev&&<div className="pos-recon-prev"><div className="big tnum">Draw {drawPrev.units<10?drawPrev.units.toFixed(1):Math.round(drawPrev.units)} units{drawPrev.doseMg!=null?` · ${fmtMg(drawPrev.doseMg)}`:""}</div><div className="sub">{drawPrev.conc?`${drawPrev.mL.toFixed(3)} mL · ${drawPrev.conc.toFixed(2)} mg/mL${drawPrev.perVial?` · ≈${drawPrev.perVial} doses/vial`:""}`:`${drawPrev.mL.toFixed(2)} mL on a U-100 syringe`}</div></div>}
        {reconOn&&drawPrev?.warn==="over"&&<div className="pos-caut" style={{marginTop:10}}><AlertTriangle size={14} style={{flexShrink:0,marginTop:1}}/>Exceeds a 1 mL (100u) syringe — {rMode==="mix"?"add more BAC water or split the dose.":"double-check, or split across injections."}</div>}
        {reconOn&&drawPrev?.warn==="tiny"&&<div className="pos-caut" style={{marginTop:10}}><AlertTriangle size={14} style={{flexShrink:0,marginTop:1}}/>Very small draw ({drawPrev.units.toFixed(1)}u) — {rMode==="mix"?"use less BAC water for a more readable amount.":"measure carefully."}</div>}
        <div className="pos-flbl">Injection site</div>
        <div className="pos-field">
          <div className="pos-frow"><label style={{flex:1,display:"flex",alignItems:"center",gap:9,width:"auto"}}><MapPin size={16} color="var(--ink-2)"/>Track injection site</label><button className={`pos-toggle ${rotate?"on":""}`} onClick={()=>setRotate(v=>!v)}/></div>
        </div>
        <div className="pos-hint" style={{paddingTop:6}}>On for injectables — you’ll pick a rotation site when you log each dose. Turn off for oral, nasal, or topical peptides.</div>
        <div className="pos-flbl">Accent</div>
        <div className="pos-field"><div className="pos-sw">{PALETTE.map(c=>(<button key={c.name} className={`pos-swatch ${color===c.hex?"sel":""}`} style={{background:c.hex}} onClick={()=>setColor(c.hex)}/>))}</div></div>
        <div className="pos-flbl">Cycle</div>
        <div className="pos-field">
          <div className="pos-frow"><label style={{flex:1,display:"flex",alignItems:"center",gap:9,width:"auto"}}><RotateCcw size={16} color="var(--ink-2)"/>Run in cycles</label><button className={`pos-toggle ${cycleOn?"on":""}`} onClick={()=>setCycleOn(v=>!v)}/></div>
          {cycleOn&&<><div className="pos-frow"><label>Weeks on</label><div style={{marginLeft:"auto"}} className="pos-step"><button disabled={onW<=1} onClick={()=>setOnW(x=>Math.max(1,x-1))}>−</button><span className="tnum">{onW}</span><button disabled={onW>=52} onClick={()=>setOnW(x=>x+1)}>+</button></div></div><div className="pos-frow"><label>Weeks off</label><div style={{marginLeft:"auto"}} className="pos-step"><button disabled={offW<=0} onClick={()=>setOffW(x=>Math.max(0,x-1))}>−</button><span className="tnum">{offW}</span><button disabled={offW>=52} onClick={()=>setOffW(x=>x+1)}>+</button></div></div></>}
        </div>
        <div className="pos-flbl">Supply</div>
        <div className="pos-field">
          <div className="pos-frow"><label style={{flex:1,display:"flex",alignItems:"center",gap:9,width:"auto"}}><Package size={16} color="var(--ink-2)"/>Track supply</label><button className={`pos-toggle ${supplyOn?"on":""}`} onClick={()=>setSupplyOn(v=>!v)}/></div>
          {supplyOn&&<>
            <div className="pos-frow"><label>Vials in stock</label><div style={{marginLeft:"auto"}} className="pos-step"><button disabled={(parseInt(supplyVials)||0)<=1} onClick={()=>setSupplyVials(x=>Math.max(1,(parseInt(x)||1)-1))}>−</button><span className="tnum">{supplyVials}</span><button onClick={()=>setSupplyVials(x=>(parseInt(x)||0)+1)}>+</button></div></div>
            {liquid&&<div className="pos-frow"><label>Vial size</label><input className="pos-input" type="number" inputMode="decimal" placeholder="e.g. 5" value={supplyVialMl} onChange={e=>setSupplyVialMl(e.target.value)}/><span style={{color:"var(--ink-3)",fontSize:14}}>mL</span></div>}
          </>}
        </div>
        {supplyOn&&<div className="pos-hint" style={{marginTop:-2}}>Counts down by every dose you log. When you restock, bump “vials in stock” and the total grows.</div>}
        {supplyOn&&(reconValid?(perVialPrev!=null?<div className="pos-recon-prev"><div className="big tnum">≈{supTotal} doses</div><div className="sub">{perVialPrev} per vial × {parseInt(supplyVials)||0} {(parseInt(supplyVials)||0)===1?"vial":"vials"}{supDays?` · lasts ${supDays>=14?`~${Math.round(supDays/7)} weeks`:`~${supDays} days`}`:""}</div></div>:<div className="pos-hint" style={{paddingTop:8}}>{liquid?"Enter your vial size (mL) above and the app will count your doses and estimate when you’ll run out.":"Finish the draw setup above and the app will count doses per vial automatically."}</div>):<div className="pos-hint" style={{paddingTop:8}}>Turn on “Track draw amount” above so the app can work out how many doses each vial holds.</div>)}
        <div className="pos-flbl">Start date</div>
        <div className="pos-field"><div className="pos-frow"><label>Started</label><input className="pos-input" type="date" value={startDate} onChange={e=>setStartDate(e.target.value)}/></div></div>
        {!isNew&&<>
          <div className="pos-flbl">History</div>
          <div className="pos-field"><button className="pos-row-btn" onClick={()=>onHistory&&onHistory(peptide)}><span style={{display:"flex",alignItems:"center",gap:10}}><CalendarDays size={17} color="var(--accent)"/>Log past doses</span><ChevronRight size={17} color="var(--ink-3)"/></button></div>
          <div className="pos-hint" style={{marginTop:-2}}>Mark the days you’ve already injected to back-fill your history.</div>
        </>}
        <div className="pos-hint">{reconOn&&"The draw amount shows on your Today timeline so you never recalc at injection time. "}{type==="everyN"&&`“Every ${n} days” counts from the start date. `}{cycleOn&&`Cycle measured from the start date. `}{supplyOn&&`Bump “vials in stock” when you restock.`}</div>
        {!isNew&&<button className="pos-del" onClick={()=>onDelete(peptide.id)}><Trash2 size={15} style={{verticalAlign:"-3px",marginRight:6}}/>Delete peptide</button>}
      </div>
    </div>
  </>);
}
