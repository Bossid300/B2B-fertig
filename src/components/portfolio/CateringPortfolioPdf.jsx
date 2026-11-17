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
  // Service- / Bar-Balken Grafik
  serviceRow: {
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
    fontSize: 34,
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
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12
  },
  chipDark: {
    backgroundColor: '#18181b',
    borderWidth: 1,
    borderColor: '#3f3f46',
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  chipTextDark: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff'
  },
  certRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
    paddingVertical: 4
  },
  grid2x2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12
  },
  gridCellImg: {
    width: '48.5%',
    height: 112,
    objectFit: 'cover'
  },
  rateGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14
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

export function CateringPortfolioDocument({ profile, references = [] }) {
  const venueName = profile?.Klarname || profile?.name || 'Catering Service';
  const heroImage = getSafeImageUrl(profile?.avatarUrl || profile?.slide1_url || profile?.gallery_slot1_url);
  
  const galleryImages = [1, 2, 3, 4]
    .map((num) => ({
      url: getSafeImageUrl(profile?.[`gallery_slot${num}_url`]),
      title: profile?.[`gallery_slot${num}_title`] || `Catering 0${num}`
    }))
    .filter((item) => Boolean(item.url));

  const skills = Array.isArray(profile?.skills) ? profile.skills.filter(Boolean) : [];
  const certificates = Array.isArray(profile?.certificates) ? profile.certificates.filter(Boolean) : [];
  const equipment = Array.isArray(profile?.equipment) ? profile.equipment.filter(Boolean) : [];

  const barHeights = [16, 28, 22, 34, 18, 30, 26, 14, 32, 20, 24, 36];

  return (
    <Document title={`${venueName} - Culinary Portfolio`}>
      {/* =========================================================
          SEITE 1: EDITORIAL COVER (A4 Querformat)
         ========================================================= */}
      <Page size="A4" orientation="landscape" style={styles.pageDark}>
        <View style={styles.coverSpine}>
          <View style={styles.coverHeaderRow}>
            <Text>GIGSDA // {profile?.id || 'CATER'}</Text>
            <Text>CULINARY EPK</Text>
          </View>

          <View style={styles.coverTypoBlock}>
            <Text style={styles.coverTitleBig}>CATERING</Text>
            <Text style={styles.coverSubtitle}>PORTFOLIO</Text>

            {/* Service-Linien Raster */}
            <View style={styles.serviceRow}>
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

            {/* Mini-Thumbnails */}
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
              {profile?.genre || 'Catering & Hospitality'}
            </Text>
            <Text style={styles.coverMeta}>
              {profile?.city ? `${profile.city} • ` : ''}
              {profile?.mobility_status || 'Mobile Kitchen'}
            </Text>
          </View>
        </View>

        <View style={styles.coverHero}>
          {heroImage && <Image src={heroImage} style={styles.coverHeroImg} />}
          <View style={styles.coverOverlay}>
            <Text style={styles.coverCategory}>
              {profile?.category || 'Festival & Event Catering'}
            </Text>
            <Text style={styles.coverName}>{venueName}</Text>
            {profile?.description && (
              <Text style={styles.coverTeaser}>{profile.description}</Text>
            )}

            <View style={styles.coverKpiBar}>
              <Text style={styles.coverKpiItem}>KAPAZITÄT: {profile?.genre || 'Bis 2500 Pax'}</Text>
              <Text style={styles.coverKpiItem}>MOBILITÄT: {profile?.mobility_status || 'Foodtruck'}</Text>
              <Text style={styles.coverKpiItem}>HACCP ZERTIFIZIERT</Text>
            </View>
          </View>
        </View>
      </Page>

      {/* =========================================================
          SEITE 2: PROFILE & STORY (Heller Kontrast)
         ========================================================= */}
      <Page size="A4" orientation="landscape" style={styles.pageLight}>
        {/* Links: Portrait & Bio */}
        <View style={styles.halfLeftLight}>
          <View>
            <View style={styles.sectionHeaderLight}>
              <Text style={styles.h2Light}>Profile</Text>
              <Text style={styles.tagLight}>01 // CULINARY</Text>
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
                  <Text style={styles.factLabel}>Unternehmen</Text>
                  <Text style={styles.factValue}>{venueName}</Text>
                </View>
                <View style={styles.factItem}>
                  <Text style={styles.factLabel}>Ansprechpartner</Text>
                  <Text style={styles.factValue}>{profile?.name || '-'}</Text>
                </View>
                <View style={styles.factItem}>
                  <Text style={styles.factLabel}>Standort & Base</Text>
                  <Text style={styles.factValue}>{profile?.city || '-'}</Text>
                </View>
                <View style={styles.factItem}>
                  <Text style={styles.factLabel}>Tageskapazität</Text>
                  <Text style={styles.factValue}>{profile?.genre || 'Bis 2500 Pax'}</Text>
                </View>
              </View>
            </View>

            {profile?.bio_einleitung && (
              <Text style={[styles.bodyText, { fontFamily: 'Helvetica-Bold' }]}>
                {profile.bio_einleitung}
              </Text>
            )}
            {profile?.bio_karriere && (
              <Text style={styles.bodyText}>{profile.bio_karriere}</Text>
            )}
            {profile?.bio_privates && (
              <Text style={styles.bodyText}>{profile.bio_privates}</Text>
            )}
            {!profile?.bio_einleitung && !profile?.bio_karriere && profile?.description && (
              <Text style={styles.bodyText}>{profile.description}</Text>
            )}
          </View>

          <View style={styles.footerLight}>
            <Text>{venueName}</Text>
            <Text>PAGE 02</Text>
          </View>
        </View>

        {/* Rechts: Visual & Contents */}
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
              <Text style={styles.tocTitle}>01. Catering Profile & Konzept</Text>
              <Text style={styles.tocPage}>P. 02</Text>
            </View>
            <View style={styles.tocRow}>
              <Text style={styles.tocTitle}>02. Kompetenzen, HACCP & Equipment</Text>
              <Text style={styles.tocPage}>P. 03</Text>
            </View>
            <View style={styles.tocRow}>
              <Text style={styles.tocTitle}>03. Impressionen & Event-Referenzen</Text>
              <Text style={styles.tocPage}>P. 03</Text>
            </View>
            <View style={styles.tocRow}>
              <Text style={styles.tocTitle}>04. Tarife, Konditionen & Kontakt</Text>
              <Text style={styles.tocPage}>P. 04</Text>
            </View>
          </View>

          <View style={styles.footerLight}>
            <Text>CULINARY PORTFOLIO</Text>
            <Text>PAGE 02</Text>
          </View>
        </View>
      </Page>

      {/* =========================================================
          SEITE 3: SKILLS, CERTIFICATES & EQUIPMENT (Dark Contrast)
         ========================================================= */}
      <Page size="A4" orientation="landscape" style={styles.pageDark}>
        {/* Links: Kompetenzen, HACCP & Equipment */}
        <View style={styles.halfLeftDark}>
          <View>
            <View style={styles.sectionHeaderDark}>
              <Text style={styles.h2Dark}>Specs & Safety</Text>
              <Text style={styles.tagDark}>02 // STANDARDS</Text>
            </View>

            <Text style={{ fontSize: 7.5, color: '#fbbf24', letterSpacing: 1.5, marginBottom: 6 }}>
              SCHWERPUNKTE & KOMPETENZEN
            </Text>
            {skills.length > 0 ? (
              <View style={styles.chipWrap}>
                {skills.map((skill, idx) => (
                  <View key={idx} style={styles.chipDark}>
                    <Text style={styles.chipTextDark}>{skill}</Text>
                  </View>
                ))}
              </View>
            ) : null}

            <Text style={{ fontSize: 7.5, color: '#fbbf24', letterSpacing: 1.5, marginBottom: 4 }}>
              HYGIENE & ZERTIFIZIERUNGEN
            </Text>
            <View style={{ marginBottom: 12 }}>
              {certificates.map((cert, idx) => (
                <View key={idx} style={styles.certRow}>
                  <Text style={{ fontSize: 8.5, color: '#fbbf24', fontFamily: 'Helvetica-Bold' }}>✓</Text>
                  <Text style={{ fontSize: 8.5, color: '#ffffff' }}>{cert}</Text>
                </View>
              ))}
            </View>

            <Text style={{ fontSize: 7.5, color: '#fbbf24', letterSpacing: 1.5, marginBottom: 4 }}>
              AUTARKES EQUIPMENT & INVENTAR
            </Text>
            {equipment.map((eq, idx) => (
              <View key={idx} style={{ marginBottom: 4 }}>
                <Text style={{ fontSize: 8.5, fontFamily: 'Helvetica-Bold', color: '#ffffff' }}>
                  • {eq.item}
                </Text>
                <Text style={{ fontSize: 8, color: '#a1a1aa', marginLeft: 8 }}>
                  {eq.detail}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.footerDark}>
            <Text>STANDARDS & EQUIPMENT</Text>
            <Text>PAGE 03</Text>
          </View>
        </View>

        {/* Rechts: Gallery & References */}
        <View style={styles.halfRightDark}>
          <View>
            <View style={styles.sectionHeaderDark}>
              <Text style={styles.h2Dark}>References</Text>
              <Text style={styles.tagDark}>03 // EVENTS</Text>
            </View>

            {galleryImages.length > 0 && (
              <View style={styles.grid2x2}>
                {galleryImages.slice(0, 4).map((img, i) => (
                  <Image key={i} src={img.url} style={styles.gridCellImg} />
                ))}
              </View>
            )}

            <Text style={{ fontSize: 8, color: '#fbbf24', letterSpacing: 1.5, marginBottom: 6 }}>
              FESTIVAL- & EVENT-REFERENZEN
            </Text>
            {references.length > 0 ? (
              references.slice(0, 4).map((ref) => (
                <View
                  key={ref.id}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderBottomWidth: 1,
                    borderBottomColor: '#27272a',
                    paddingVertical: 4
                  }}
                >
                  <Text style={{ fontSize: 8.5, color: '#ffffff', fontFamily: 'Helvetica-Bold' }}>
                    {ref.title} ({ref.date})
                  </Text>
                  <Text style={{ fontSize: 8, color: '#a1a1aa' }}>{ref.format || 'Festival'}</Text>
                </View>
              ))
            ) : (
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#27272a', paddingVertical: 4 }}>
                  <Text style={{ fontSize: 8.5, color: '#ffffff', fontFamily: 'Helvetica-Bold' }}>Raunenfehesang (30.10.2026)</Text>
                  <Text style={{ fontSize: 8, color: '#a1a1aa' }}>Open Air</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: '#27272a', paddingVertical: 4 }}>
                  <Text style={{ fontSize: 8.5, color: '#ffffff', fontFamily: 'Helvetica-Bold' }}>Woodstock 3 (01.01.2027)</Text>
                  <Text style={{ fontSize: 8, color: '#a1a1aa' }}>Festival</Text>
                </View>
              </View>
            )}
          </View>

          <View style={styles.footerDark}>
            <Text>GALLERY & REFERENCES</Text>
            <Text>PAGE 03</Text>
          </View>
        </View>
      </Page>

      {/* =========================================================
          SEITE 4: RATES & BOOKING CONTACT
         ========================================================= */}
      <Page size="A4" orientation="landscape" style={styles.pageLight}>
        {/* Links: Honorare & Rahmenbedingungen */}
        <View style={styles.halfLeftLight}>
          <View>
            <View style={styles.sectionHeaderLight}>
              <Text style={styles.h2Light}>Rates & Terms</Text>
              <Text style={styles.tagLight}>04 // FINANCIALS</Text>
            </View>

            <Text style={styles.bodyText}>
              Transparente Konditionen für Festival-Catering, Crew-Verpflegung, Tournee-Hospitality und VIP-Lounges:
            </Text>

            <View style={styles.rateGrid}>
              <View style={styles.rateBox}>
                <Text style={styles.factLabel}>Stundensatz</Text>
                <Text style={[styles.factValue, { fontSize: 13, marginTop: 3 }]}>
                  {profile?.rate_hour ? `${profile.rate_hour} €` : '80 €'}
                </Text>
              </View>
              <View style={styles.rateBox}>
                <Text style={styles.factLabel}>Tagessatz</Text>
                <Text style={[styles.factValue, { fontSize: 13, marginTop: 3 }]}>
                  {profile?.rate_day ? `${profile.rate_day} €` : '650 €'}
                </Text>
              </View>
              <View style={styles.rateBox}>
                <Text style={styles.factLabel}>Gage Min. / Max.</Text>
                <Text style={[styles.factValue, { fontSize: 11, marginTop: 3 }]}>
                  {profile?.gage_min || profile?.gage_max
                    ? `${profile?.gage_min || '400'} € – ${profile?.gage_max || '1200'} €`
                    : 'Auf Anfrage'}
                </Text>
              </View>
              <View style={styles.rateBox}>
                <Text style={styles.factLabel}>Feste Küchencrew</Text>
                <Text style={[styles.factValue, { fontSize: 11, marginTop: 3 }]}>
                  12 Personen vor Ort
                </Text>
              </View>
            </View>

            <View
              style={{
                backgroundColor: '#f4f4f5',
                borderLeftWidth: 3,
                borderLeftColor: '#000000',
                padding: 10
              }}
            >
              <Text style={styles.factLabel}>Zahlung & Steuer</Text>
              <Text style={{ fontSize: 8.5, color: '#27272a', marginTop: 3, lineHeight: 1.4 }}>
                Zahlungsziel: 14 Tage rein netto. Regelbesteuerung (zzgl. MwSt.). USt-ID: {profile?.company_uid || 'atu123'}.
              </Text>
            </View>
          </View>

          <View style={styles.footerLight}>
            <Text>RATES & FINANCIALS</Text>
            <Text>PAGE 04</Text>
          </View>
        </View>

        {/* Rechts: Booking Contact */}
        <View style={styles.halfRightDark}>
          <View>
            <Text style={{ fontSize: 8, color: '#fbbf24', letterSpacing: 2, marginBottom: 4 }}>
              DIRECT CATERING BOOKING
            </Text>
            <Text style={[styles.h2Dark, { fontSize: 24, marginBottom: 12 }]}>
              Booking Contact
            </Text>
            <Text style={{ fontSize: 9, color: '#a1a1aa', lineHeight: 1.5, marginBottom: 20 }}>
              Für Catering-Anfragen, Menü-Absprachen, Rider-Abstimmungen und Festival-Bookings kontaktieren Sie direkt:
            </Text>

            <View style={{ borderTopWidth: 1, borderTopColor: '#27272a', paddingTop: 12 }}>
              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 7.5, color: '#71717a', letterSpacing: 1.5 }}>E-MAIL</Text>
                <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#ffffff', marginTop: 2 }}>
                  {profile?.email || 'cater@john.at'}
                </Text>
              </View>

              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 7.5, color: '#71717a', letterSpacing: 1.5 }}>TELEFON</Text>
                <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#ffffff', marginTop: 2 }}>
                  {profile?.phone || '+43 123456'}
                </Text>
              </View>

              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 7.5, color: '#71717a', letterSpacing: 1.5 }}>ADRESSE & WEB</Text>
                <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#ffffff', marginTop: 2 }}>
                  {profile?.street}, {profile?.plz} {profile?.city}
                </Text>
                <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#fbbf24', marginTop: 2 }}>
                  {profile?.website || 'https://www.gigsda.com'}
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

export function DownloadCateringPdfButton({ profile, references }) {
  const venueName = profile?.Klarname || profile?.name || 'Catering';
  const safeName = venueName
    .replace(/[^a-zA-Z0-9äöüÄÖÜß_-]/g, '_')
    .replace(/_+/g, '_');

  return (
    <PDFDownloadLink
      document={<CateringPortfolioDocument profile={profile} references={references} />}
      fileName={`${safeName}_Culinary_Portfolio.pdf`}
      className="px-4 py-1.5 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-amber-400 transition"
    >
      {({ loading }) => (loading ? 'Generiere PDF...' : 'Catering-PDF herunterladen')}
    </PDFDownloadLink>
  );
}