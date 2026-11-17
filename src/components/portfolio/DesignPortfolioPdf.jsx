import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  PDFDownloadLink
} from '@react-pdf/renderer';

const getSafeImageUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('/')) {
    return typeof window !== 'undefined' ? `${window.location.origin}${url}` : url;
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    if (typeof window !== 'undefined' && !url.startsWith(window.location.origin)) {
      return `${window.location.origin}/api/pdf_image.php?url=${encodeURIComponent(url)}`;
    }
    return url;
  }
  return url;
};

const styles = StyleSheet.create({
  pageDark: {
    flexDirection: 'row',
    backgroundColor: '#0a0a0a',
    color: '#ffffff',
    fontFamily: 'Helvetica',
    padding: 0
  },
  pageLight: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    color: '#111111',
    fontFamily: 'Helvetica',
    padding: 0
  },
  // Cover Spine (Links)
  coverSpine: {
    width: '34%',
    backgroundColor: '#080808',
    borderRightWidth: 1,
    borderRightColor: '#27272a',
    padding: 28,
    justifyContent: 'space-between'
  },
  coverHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 7,
    letterSpacing: 2,
    color: '#a1a1aa',
    textTransform: 'uppercase'
  },
  coverTypoBlock: {
    marginVertical: 14
  },
  coverTitleBig: {
    fontSize: 32,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: -1,
    color: '#ffffff',
    textTransform: 'uppercase',
    lineHeight: 0.95
  },
  coverSubtitle: {
    fontSize: 12,
    letterSpacing: 6,
    color: '#fbbf24',
    textTransform: 'uppercase',
    marginTop: 6
  },
  secRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 34,
    gap: 4,
    marginTop: 18
  },
  coverThumbRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16
  },
  coverThumb: {
    width: 58,
    height: 58,
    objectFit: 'cover',
    borderWidth: 1,
    borderColor: '#3f3f46'
  },
  coverFooter: {
    borderTopWidth: 1,
    borderTopColor: '#27272a',
    paddingTop: 10
  },
  coverGenre: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: '#ffffff'
  },
  coverMeta: {
    fontSize: 8,
    color: '#a1a1aa',
    marginTop: 3
  },
  // Cover Hero (Rechts)
  coverHero: {
    width: '66%',
    position: 'relative',
    backgroundColor: '#18181b',
    justifyContent: 'flex-end'
  },
  coverHeroImg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  coverOverlay: {
    backgroundColor: 'rgba(0,0,0,0.72)',
    padding: 32
  },
  coverCategory: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 3,
    color: '#fbbf24',
    textTransform: 'uppercase',
    marginBottom: 6
  },
  coverName: {
    fontSize: 32,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    textTransform: 'uppercase',
    letterSpacing: -0.5
  },
  coverTeaser: {
    fontSize: 10,
    color: '#e4e4e7',
    lineHeight: 1.45,
    marginTop: 8,
    maxWidth: 420
  },
  coverKpiBar: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#3f3f46'
  },
  coverKpiItem: {
    fontSize: 8,
    color: '#fbbf24',
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 1
  },

  // Standard 50/50 Doppelseite
  halfLeftLight: {
    width: '50%',
    padding: 32,
    borderRightWidth: 1,
    borderRightColor: '#e4e4e7',
    justifyContent: 'space-between'
  },
  halfRightLight: {
    width: '50%',
    padding: 32,
    backgroundColor: '#fafafa',
    justifyContent: 'space-between'
  },
  halfLeftDark: {
    width: '50%',
    padding: 32,
    backgroundColor: '#0d0d0d',
    borderRightWidth: 1,
    borderRightColor: '#27272a',
    justifyContent: 'space-between'
  },
  halfRightDark: {
    width: '50%',
    padding: 32,
    backgroundColor: '#050505',
    justifyContent: 'space-between'
  },

  // Typografie & Sektionen
  sectionHeaderLight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
    paddingBottom: 6,
    marginBottom: 14
  },
  sectionHeaderDark: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderBottomWidth: 1,
    borderBottomColor: '#3f3f46',
    paddingBottom: 6,
    marginBottom: 14
  },
  h2Light: {
    fontSize: 21,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: -0.5,
    color: '#000000'
  },
  h2Dark: {
    fontSize: 21,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: -0.5,
    color: '#ffffff'
  },
  tagLight: {
    fontSize: 8,
    color: '#71717a',
    letterSpacing: 1.5
  },
  tagDark: {
    fontSize: 8,
    color: '#fbbf24',
    letterSpacing: 1.5
  },
  profileTopRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 14
  },
  portraitImg: {
    width: 112,
    height: 140,
    objectFit: 'cover',
    backgroundColor: '#e4e4e7'
  },
  factsCol: {
    flex: 1,
    justifyContent: 'space-between'
  },
  factItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
    paddingBottom: 4,
    marginBottom: 5
  },
  factLabel: {
    fontSize: 7,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: '#71717a'
  },
  factValue: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Bold',
    color: '#111111',
    marginTop: 1
  },
  bodyText: {
    fontSize: 8.8,
    lineHeight: 1.48,
    color: '#27272a',
    marginBottom: 8
  },
  wideImg: {
    width: '100%',
    height: 185,
    objectFit: 'cover',
    marginBottom: 16
  },
  tocRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#d4d4d8',
    paddingVertical: 6
  },
  tocTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8
  },
  tocPage: {
    fontSize: 8.5,
    color: '#71717a'
  },
  serviceCard: {
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#3f3f46',
    padding: 8,
    marginBottom: 6
  },
  cardTitle: {
    fontSize: 7.5,
    color: '#fbbf24',
    fontFamily: 'Helvetica-Bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2
  },
  cardDetail: {
    fontSize: 8.5,
    color: '#ffffff',
    lineHeight: 1.35
  },
  rateBox: {
    width: '47%',
    backgroundColor: '#f4f4f5',
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#000000'
  },
  footerLight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e4e4e7',
    paddingTop: 8,
    fontSize: 7.5,
    color: '#a1a1aa'
  },
  footerDark: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#27272a',
    paddingTop: 8,
    fontSize: 7.5,
    color: '#71717a'
  }
});

export function DesignPortfolioDocument({ profile, references = [] }) {
  const companyName = profile?.Klarname || profile?.name || 'VISUALSTAGE DESIGN STUDIO';
  const heroImage = getSafeImageUrl(profile?.slide1_url || profile?.gallery_slot1_url || profile?.avatarUrl);
  
  const galleryImages = [1, 2, 3, 4]
    .map((num) => ({
      url: getSafeImageUrl(profile?.[`slide${num}_url`] || profile?.[`gallery_slot${num}_url`]),
      title: profile?.[`slide${num}_line1`] || `Design 0${num}`
    }))
    .filter((item) => Boolean(item.url));

  const barHeights = [22, 38, 28, 42, 20, 34, 30, 45, 18, 36, 25, 32];

  return (
    <Document title={`${companyName} - Design Portfolio`}>
      {/* =========================================================
          SEITE 1: EDITORIAL COVER (A4 Querformat)
         ========================================================= */}
      <Page size="A4" orientation="landscape" style={styles.pageDark}>
        <View style={styles.coverSpine}>
          <View style={styles.coverHeaderRow}>
            <Text>GIGSDA // {profile?.id || 'DESI'}</Text>
            <Text>DESIGN EPK</Text>
          </View>

          <View style={styles.coverTypoBlock}>
            <Text style={styles.coverTitleBig}>VISUAL</Text>
            <Text style={styles.coverSubtitle}>STUDIO</Text>

            <View style={styles.secRow}>
              {barHeights.map((h, i) => (
                <View
                  key={i}
                  style={{
                    width: 3,
                    height: h,
                    backgroundColor: '#fbbf24'
                  }}
                />
              ))}
            </View>

            {galleryImages.length > 0 && (
              <View style={styles.coverThumbRow}>
                {galleryImages.slice(0, 2).map((img, idx) => (
                  <Image key={idx} src={img.url} style={styles.coverThumb} />
                ))}
              </View>
            )}
          </View>

          <View style={styles.coverFooter}>
            <Text style={styles.coverGenre}>
              {profile?.genre || 'Bühnenarchitektur & 3D'}
            </Text>
            <Text style={styles.coverMeta}>
              {profile?.city ? `${profile.city} • ` : ''}
              {profile?.designer_experience_kpi || '9+ Jahre'} Erfahrung
            </Text>
          </View>
        </View>

        <View style={styles.coverHero}>
          {heroImage && <Image src={heroImage} style={styles.coverHeroImg} />}
          <View style={styles.coverOverlay}>
            <Text style={styles.coverCategory}>
              {profile?.category || 'Design- & Visualisierung'}
            </Text>
            <Text style={styles.coverName}>{companyName}</Text>
            {profile?.description && (
              <Text style={styles.coverTeaser}>{profile.description}</Text>
            )}

            <View style={styles.coverKpiBar}>
              <Text style={styles.coverKpiItem}>ERFAHRUNG: {profile?.designer_experience_kpi || '9+ Jahre'}</Text>
              <Text style={styles.coverKpiItem}>DISZIPLINEN: {profile?.designer_disciplines_kpi || '4'}</Text>
              <Text style={styles.coverKpiItem}>REFERENZEN: {profile?.designer_references_kpi || '23'}</Text>
            </View>
          </View>
        </View>
      </Page>

      {/* =========================================================
          SEITE 2: PROFILE & STORY (Heller Kontrast)
         ========================================================= */}
      <Page size="A4" orientation="landscape" style={styles.pageLight}>
        <View style={styles.halfLeftLight}>
          <View>
            <View style={styles.sectionHeaderLight}>
              <Text style={styles.h2Light}>Profile</Text>
              <Text style={styles.tagLight}>01 // STUDIO</Text>
            </View>

            <View style={styles.profileTopRow}>
              {(galleryImages[0]?.url || heroImage) && (
                <Image
                  src={galleryImages[0]?.url || heroImage}
                  style={styles.portraitImg}
                />
              )}
              <View style={styles.factsCol}>
                <View style={styles.factItem}>
                  <Text style={styles.factLabel}>Studio & Lead</Text>
                  <Text style={styles.factValue}>{profile?.designer_studio_creative_lead || companyName}</Text>
                </View>
                <View style={styles.factItem}>
                  <Text style={styles.factLabel}>Standort & Methode</Text>
                  <Text style={styles.factValue}>{profile?.designer_location_working_method || profile?.city || '-'}</Text>
                </View>
                <View style={styles.factItem}>
                  <Text style={styles.factLabel}>Berufserfahrung</Text>
                  <Text style={styles.factValue}>{profile?.designer_professional_experience || '9+ Jahre'}</Text>
                </View>
              </View>
            </View>

            {profile?.bio_einleitung && (
              <Text style={styles.bodyText}>{profile.bio_einleitung}</Text>
            )}
            {profile?.designer_core_disciplines && (
              <Text style={styles.bodyText}>Kernbereiche: {profile.designer_core_disciplines}</Text>
            )}
          </View>

          <View style={styles.footerLight}>
            <Text>{companyName}</Text>
            <Text>PAGE 02</Text>
          </View>
        </View>

        <View style={styles.halfRightLight}>
          <View>
            {(galleryImages[1]?.url || heroImage) && (
              <Image
                src={galleryImages[1]?.url || heroImage}
                style={styles.wideImg}
              />
            )}

            <View style={styles.sectionHeaderLight}>
              <Text style={[styles.h2Light, { fontSize: 18 }]}>Contents</Text>
              <Text style={styles.tagLight}>INDEX</Text>
            </View>

            <View style={styles.tocRow}>
              <Text style={styles.tocTitle}>01. Studio-Profil & Kernkompetenzen</Text>
              <Text style={styles.tocPage}>P. 02</Text>
            </View>
            <View style={styles.tocRow}>
              <Text style={styles.tocTitle}>02. Leistungsspektrum & Deliverables</Text>
              <Text style={styles.tocPage}>P. 03</Text>
            </View>
            <View style={styles.tocRow}>
              <Text style={styles.tocTitle}>03. Software-Stack & CAD-Standards</Text>
              <Text style={styles.tocPage}>P. 03</Text>
            </View>
            <View style={styles.tocRow}>
              <Text style={styles.tocTitle}>04. Honorare, Pakete & Kontakt</Text>
              <Text style={styles.tocPage}>P. 04</Text>
            </View>
          </View>

          <View style={styles.footerLight}>
            <Text>DESIGN PORTFOLIO</Text>
            <Text>PAGE 02</Text>
          </View>
        </View>
      </Page>

      {/* =========================================================
          SEITE 3: LEISTUNGSSPEKTRUM & SOFTWARE (Dark Contrast)
         ========================================================= */}
      <Page size="A4" orientation="landscape" style={styles.pageDark}>
        <View style={styles.halfLeftDark}>
          <View>
            <View style={styles.sectionHeaderDark}>
              <Text style={styles.h2Dark}>Services</Text>
              <Text style={styles.tagDark}>02 // CAPABILITIES</Text>
            </View>

            {profile?.designer_service_stage_set_design && (
              <View style={styles.serviceCard}>
                <Text style={styles.cardTitle}>Bühnen- & Set-Design (3D & CAD)</Text>
                <Text style={styles.cardDetail}>{profile.designer_service_stage_set_design}</Text>
              </View>
            )}
            {profile?.designer_service_3d_visualization && (
              <View style={styles.serviceCard}>
                <Text style={styles.cardTitle}>Fotorealistische 3D-Visualisierung</Text>
                <Text style={styles.cardDetail}>{profile.designer_service_3d_visualization}</Text>
              </View>
            )}
            {profile?.designer_service_event_branding && (
              <View style={styles.serviceCard}>
                <Text style={styles.cardTitle}>Event-Branding & Key-Visuals</Text>
                <Text style={styles.cardDetail}>{profile.designer_service_event_branding}</Text>
              </View>
            )}
          </View>

          <View style={styles.footerDark}>
            <Text>DESIGN SERVICES</Text>
            <Text>PAGE 03</Text>
          </View>
        </View>

        <View style={styles.halfRightDark}>
          <View>
            <View style={styles.sectionHeaderDark}>
              <Text style={styles.h2Dark}>Software Stack</Text>
              <Text style={styles.tagDark}>03 // TECHNICAL</Text>
            </View>

            <View style={{ marginBottom: 8 }}>
              <Text style={{ fontSize: 7.5, color: '#fbbf24', letterSpacing: 1.5, marginBottom: 2 }}>
                CAD & LICHT-PRE-VIZ
              </Text>
              <Text style={{ fontSize: 8.5, color: '#ffffff', marginBottom: 5 }}>
                {profile?.designer_software_cad_light_previs || 'Vectorworks Spotlight, WYSIWYG, Capture, Depence R3'}
              </Text>

              <Text style={{ fontSize: 7.5, color: '#fbbf24', letterSpacing: 1.5, marginBottom: 2 }}>
                3D-MODELLING & MOTION
              </Text>
              <Text style={{ fontSize: 8.5, color: '#ffffff', marginBottom: 5 }}>
                {profile?.designer_software_3d_modelling_motion || 'Cinema 4D, Blender, Octane Render, After Effects'}
              </Text>

              <Text style={{ fontSize: 7.5, color: '#fbbf24', letterSpacing: 1.5, marginBottom: 2 }}>
                GRAFIK, LAYOUT & PRINT
              </Text>
              <Text style={{ fontSize: 8.5, color: '#ffffff', marginBottom: 5 }}>
                {profile?.designer_software_graphics_layout_print || 'Adobe Illustrator, InDesign, Photoshop (PDF/X-4)'}
              </Text>

              <Text style={{ fontSize: 7.5, color: '#fbbf24', letterSpacing: 1.5, marginBottom: 2 }}>
                PRODUKTIONS-SCHNITTSTELLE
              </Text>
              <Text style={{ fontSize: 8.5, color: '#ffffff' }}>
                {profile?.designer_software_production_interface || 'Abstimmung mit Technischer Leitung & Druckereien'}
              </Text>
            </View>
          </View>

          <View style={styles.footerDark}>
            <Text>SOFTWARE & WORKFLOW</Text>
            <Text>PAGE 03</Text>
          </View>
        </View>
      </Page>

      {/* =========================================================
          SEITE 4: RATES & BOOKING CONTACT
         ========================================================= */}
      <Page size="A4" orientation="landscape" style={styles.pageLight}>
        <View style={styles.halfLeftLight}>
          <View>
            <View style={styles.sectionHeaderLight}>
              <Text style={styles.h2Light}>Rates & Packages</Text>
              <Text style={styles.tagLight}>04 // FINANCIALS</Text>
            </View>

            <Text style={styles.bodyText}>
              Transparente Honorare und Pauschalen für Design, CAD-Planung und Key-Visuals:
            </Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              <View style={styles.rateBox}>
                <Text style={styles.factLabel}>Stundensatz</Text>
                <Text style={[styles.factValue, { fontSize: 9.5, marginTop: 2 }]}>
                  {profile?.designer_rate_hourly || '75,00 EUR / Stunde'}
                </Text>
              </View>
              <View style={styles.rateBox}>
                <Text style={styles.factLabel}>Tagessatz (8 Std.)</Text>
                <Text style={[styles.factValue, { fontSize: 9.5, marginTop: 2 }]}>
                  {profile?.designer_rate_daily || '560,00 EUR / Tag'}
                </Text>
              </View>
              <View style={styles.rateBox}>
                <Text style={styles.factLabel}>Event Key-Visual Paket</Text>
                <Text style={[styles.factValue, { fontSize: 9, marginTop: 2 }]}>
                  {profile?.designer_package_event_key_visual_social_kit || 'Ab 690,00 EUR'}
                </Text>
              </View>
              <View style={styles.rateBox}>
                <Text style={styles.factLabel}>3D Stage Design & CAD</Text>
                <Text style={[styles.factValue, { fontSize: 9, marginTop: 2 }]}>
                  {profile?.designer_package_3d_stage_design_cad_plan || 'Ab 950,00 EUR'}
                </Text>
              </View>
            </View>

            <View style={{ backgroundColor: '#f4f4f5', padding: 8, borderLeftWidth: 3, borderLeftColor: '#000000' }}>
              <Text style={styles.factLabel}>Zahlungsziel & Steuer</Text>
              <Text style={{ fontSize: 8.5, color: '#27272a', marginTop: 2 }}>
                Zahlungsziel: 14 Tage rein netto. Regelbesteuerung (zzgl. MwSt.). UID: {profile?.company_uid || '567567567'}.
              </Text>
            </View>
          </View>

          <View style={styles.footerLight}>
            <Text>RATES & PACKAGES</Text>
            <Text>PAGE 04</Text>
          </View>
        </View>

        <View style={styles.halfRightDark}>
          <View>
            <Text style={{ fontSize: 8, color: '#fbbf24', letterSpacing: 2, marginBottom: 4 }}>
              STUDIO CONTACT & BOOKING
            </Text>
            <Text style={[styles.h2Dark, { fontSize: 24, marginBottom: 12 }]}>
              Booking Contact
            </Text>
            <Text style={{ fontSize: 9, color: '#a1a1aa', lineHeight: 1.5, marginBottom: 20 }}>
              Für Design-Aufträge, 3D-Visualisierungen und CAD-Planungen erreichen Sie das Studio unter:
            </Text>

            <View style={{ borderTopWidth: 1, borderTopColor: '#27272a', paddingTop: 12 }}>
              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 7.5, color: '#71717a', letterSpacing: 1.5 }}>STUDIO & ADRESSE</Text>
                <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#ffffff', marginTop: 2 }}>
                  {companyName}<br />
                  {profile?.street}, {profile?.plz} {profile?.city}
                </Text>
              </View>

              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 7.5, color: '#71717a', letterSpacing: 1.5 }}>E-MAIL</Text>
                <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#ffffff', marginTop: 2 }}>
                  {profile?.email || 'design@fux.at'}
                </Text>
              </View>

              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 7.5, color: '#71717a', letterSpacing: 1.5 }}>TELEFON</Text>
                <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#ffffff', marginTop: 2 }}>
                  {profile?.phone || '34563456'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.footerDark}>
            <Text>POWERED BY GIGSDA.COM</Text>
            <Text>{new Date().getFullYear()}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

export function DownloadDesignPdfButton({ profile, references }) {
  const companyName = profile?.Klarname || profile?.name || 'Design';
  const safeName = companyName
    .replace(/[^a-zA-Z0-9äöüÄÖÜß_-]/g, '_')
    .replace(/_+/g, '_');

  return (
    <PDFDownloadLink
      document={<DesignPortfolioDocument profile={profile} references={references} />}
      fileName={`${safeName}_Design_Portfolio.pdf`}
      className="px-4 py-1.5 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-amber-400 transition"
    >
      {({ loading }) => (loading ? 'Generiere PDF...' : 'Design-PDF herunterladen')}
    </PDFDownloadLink>
  );
}