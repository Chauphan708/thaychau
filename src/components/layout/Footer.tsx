import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Heart, Mail, Phone, ExternalLink, GraduationCap, 
  MessageCircle, MapPin, ArrowUpRight 
} from "lucide-react";
import { useSiteData } from "@/context/SiteContext";
import { obfuscateEmail } from "@/lib/utils";

export default function Footer() {
  const { config } = useSiteData();
  const siteConfig = config; // Mapping for compatibility
  const currentYear = new Date().getFullYear();
  const [phoneVisible, setPhoneVisible] = useState(false);

  return (
    <footer className="relative mt-20 overflow-hidden border-t" style={{ borderColor: "var(--color-border)", background: "var(--color-bg)" }}>
      {/* Subtle Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Brand Column */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <Link to="/" className="flex items-center gap-2.5 no-underline group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:rotate-12" 
                style={{ background: "linear-gradient(135deg, var(--color-primary), #7c3aed)" }}>
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight" style={{ color: "var(--color-text)", fontFamily: "var(--font-heading)" }}>
                {siteConfig.teacherName}
              </span>
            </Link>
            
            <p className="text-sm leading-relaxed max-w-sm" style={{ color: "var(--color-text-secondary)" }}>
              {siteConfig.quote}
            </p>
            
            <div className="flex items-center gap-4">
              <a href={siteConfig.facebookLink} target="_blank" rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "var(--color-bg-secondary)", color: "var(--color-text)" }}
                aria-label="Facebook">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href={siteConfig.zaloLink} target="_blank" rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
                style={{ background: "var(--color-bg-secondary)", color: "var(--color-text)" }}
                aria-label="Zalo">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Contact Column */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <h4 className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-text-secondary)" }}>
              Thông tin liên hệ
            </h4>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 group">
                <div className="mt-1 w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(37,99,235,0.08)" }}>
                  <Mail className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase" style={{ color: "var(--color-text-secondary)" }}>Email</p>
                  <a href={`mailto:${siteConfig.email}`} className="text-sm no-underline hover:underline" style={{ color: "var(--color-text)" }}>
                    {obfuscateEmail(siteConfig.email)}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <div className="mt-1 w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(22,163,74,0.08)" }}>
                  <Phone className="w-4 h-4" style={{ color: "var(--color-secondary)" }} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase" style={{ color: "var(--color-text-secondary)" }}>Số điện thoại</p>
                  <button 
                    onClick={() => setPhoneVisible(!phoneVisible)}
                    className="text-sm border-none bg-transparent p-0 cursor-pointer text-left hover:underline"
                    style={{ color: "var(--color-text)" }}
                  >
                    {phoneVisible ? siteConfig.phone : "Nhấp để hiển thị SĐT"}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3 group">
                <div className="mt-1 w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(245,158,11,0.08)" }}>
                  <MapPin className="w-4 h-4" style={{ color: "var(--color-accent)" }} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase" style={{ color: "var(--color-text-secondary)" }}>Công tác</p>
                  <p className="text-sm" style={{ color: "var(--color-text)" }}>
                    {siteConfig.school}, {siteConfig.district}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 flex flex-col gap-6">
            <h4 className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--color-text-secondary)" }}>
              Liên kết nhanh
            </h4>
            <nav className="flex flex-col gap-3">
              {[
                { to: "/ho-so", label: "Về giáo viên" },
                { to: "/hoc-lieu", label: "Kho học liệu" },
                { to: "/phu-huynh", label: "Góc phụ huynh" }
              ].map(link => (
                <Link key={link.to} to={link.to} className="text-sm no-underline flex items-center gap-1 group transition-all hover:translate-x-1" style={{ color: "var(--color-text)" }}>
                  {link.label}
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
              
              {siteConfig.integrations.openlms.enabled && (
                <a href={siteConfig.integrations.openlms.url} target="_blank" rel="noopener noreferrer" 
                  className="text-sm no-underline flex items-center gap-1 group font-semibold" 
                  style={{ color: "var(--color-accent)" }}>
                  {siteConfig.integrations.openlms.label}
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </nav>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: "var(--color-border)" }}>
          <p className="text-xs flex items-center gap-1" style={{ color: "var(--color-text-secondary)" }}>
            © {currentYear} {siteConfig.teacherName}. Made with <Heart className="w-3 h-3 fill-red-500 text-red-500" /> for Education.
            <Link to="/admin" className="ml-2 opacity-20 hover:opacity-100 transition-opacity no-underline" style={{ color: "var(--color-text-secondary)" }}>• Admin</Link>
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[10px] font-medium tracking-widest uppercase" style={{ color: "var(--color-text-secondary)" }}>
              Professional Teacher Portfolio v1.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
