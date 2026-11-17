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
  // Supporter-Balken Grafik
  fanRow: {
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
  perkBox: {
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

export function FanPortfolioDocument({ profile, references = [] }) {
  const fanName = profile?.Klarname || profile?.name || 'Fanny Helps';
  const heroImage = getSafeImageUrl(profile?.avatarUrl || profile?.slide1_url);
  
  const galleryImages = [1, 2, 3, 4]
    .map((num) => ({
      url: getSafeImageUrl(profile?.[`slide${num}_url`]),
      title: `Supporter Moment 0${num}`
    }))
    .filter((item) => Boolean(item.url));

  const barHeights = [26, 38, 22, 42, 30, 34, 18, 40, 24, 36, 20, 32];

  return (
    <Document title={`${fanName} - Supporter Portfolio`}>
      {/* =========================================================
          SEITE 1: EDITORIAL COVER (A4 Querformat)
         ========================================================= */}
      <Page size="A4" orientation="landscape" style={styles.pageDark}>
        <View style={styles.coverSpine}>
          <View style={styles.coverHeaderRow}>
            <Text>GIGSDA // {profile?.id || 'FAN'}</Text>
            <Text>SUPPORTER PASS</Text>
          </View>

          <View style={styles.coverTypoBlock}>
            <Text style={styles.coverTitleBig}>FIRST ROW</Text>
            <Text style={styles.coverSubtitle}>SUPPORTER</Text>

            {/* Supporter-Balken Raster */}
            <View style={styles.fanRow}>
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
              {profile?.fan_supporter_level_kpi || 'First Row'} // Street-Team
            </Text>
            <Text style={styles.coverMeta}>
              {profile?.city ? `${profile.city} • ` : ''}
              {profile?.fan_events_attended_kpi || '28'} Besuchte Events
            </Text>
          </View>
        </View>

        <View style={styles.coverHero}>
          {heroImage && <Image src={heroImage} style={styles.coverHeroImg} />}
          <View style={styles.coverOverlay}>
            <Text style={styles.coverCategory}>
              {profile?.category || 'Verifizierter GIGSDA Community Supporter'}
            </Text>
            <Text style={styles.coverName}>{fanName}</Text>
            {profile?.description && (
              <Text style={styles.coverTeaser}>{profile.description}</Text>
            )}

            <View style={styles.coverKpiBar}>
              <Text style={styles.coverKpiItem}>EVENTS: {profile?.fan_events_attended_kpi || '28'}</Text>
              <Text style={styles.coverKpiItem}>NETZWERK: {profile?.fan_referred_members_kpi || '12'} Mitglieder</Text>
              <Text style={styles.coverKpiItem}>LEVEL: {profile?.fan_supporter_level_kpi || 'First Row'}</Text>
            </View>
          </View>
        </View>
      </Page>

      {/* =========================================================
          SEITE 2: PROFILE & MUSIK-DNA (Heller Kontrast)
         ========================================================= */}
      <Page size="A4" orientation="landscape" style={styles.pageLight}>
        {/* Links: Portrait & Stammdaten */}
        <View style={styles.halfLeftLight}>
          <View>
            <View style={styles.sectionHeaderLight}>
              <Text style={styles.h2Light}>Profile</Text>
              <Text style={styles.tagLight}>01 // SUPPORTER</Text>
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
                  <Text style={styles.factLabel}>Name</Text>
                  <Text style={styles.factValue}>{fanName}</Text>
                </View>
                <View style={styles.factItem}>
                  <Text style={styles.factLabel}>Level & Badges</Text>
                  <Text style={styles.factValue}>{profile?.fan_supporter_level_badges || 'First-Row Supporter'}</Text>
                </View>
                <View style={styles.factItem}>
                  <Text style={styles.factLabel}>Heimatregion & Radius</Text>
                  <Text style={styles.factValue}>{profile?.city || '-'} (100 km Umkreis)</Text>
                </View>
                <View style={styles.factItem}>
                  <Text style={styles.factLabel}>Mobilität & Carpooling</Text>
                  <Text style={styles.factValue}>PKW (3 Mitfahrplätze)</Text>
                </View>
              </View>
            </View>

            {profile?.fan_main_genres && (
              <Text style={styles.bodyText}>Haupt-Genres: {profile.fan_main_genres}</Text>
            )}
            {profile?.fan_preferred_event_formats && (
              <Text style={styles.bodyText}>Event-Formate: {profile.fan_preferred_event_formats}</Text>
            )}
            {profile?.fan_favorite_network_acts && (
              <Text style={styles.bodyText}>Favorisierte Netzwerk-Acts: {profile.fan_favorite_network_acts}</Text>
            )}
          </View>

          <View style={styles.footerLight}>
            <Text>{fanName}</Text>
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
              <Text style={styles.tocTitle}>01. Supporter-Profil & Musik-DNA</Text>
              <Text style={styles.tocPage}>P. 02</Text>
            </View>
            <View style={styles.tocRow}>
              <Text style={styles.tocTitle}>02. Street-Team & Supporter-Angebot</Text>
              <Text style={styles.tocPage}>P. 03</Text>
            </View>
            <View style={styles.tocRow}>
              <Text style={styles.tocTitle}>03. Live-Impressionen & Stamm-Locations</Text>
              <Text style={styles.tocPage}>P. 03</Text>
            </View>
            <View style={styles.tocRow}>
              <Text style={styles.tocTitle}>04. VIP-Programme, Gästeliste & Kontakt</Text>
              <Text style={styles.tocPage}>P. 04</Text>
            </View>
          </View>

          <View style={styles.footerLight}>
            <Text>FAN & SUPPORTER PORTFOLIO</Text>
            <Text>PAGE 02</Text>
          </View>
        </View>
      </Page>

      {/* =========================================================
          SEITE 3: STREET-TEAM & IMPRESSIONS (Dark Contrast)
         ========================================================= */}
      <Page size="A4" orientation="landscape" style={styles.pageDark}>
        {/* Links: Street-Team & Supporter-Angebot */}
        <View style={styles.halfLeftDark}>
          <View>
            <View style={styles.sectionHeaderDark}>
              <Text style={styles.h2Dark}>Street-Team</Text>
              <Text style={styles.tagDark}>02 // SUPPORT</Text>
            </View>

            {profile?.fan_local_promotion_word_of_mouth && (
              <View style={styles.serviceCard}>
                <Text style={styles.cardTitle}>Lokale Promotion & Mundpropaganda</Text>
                <Text style={styles.cardDetail}>{profile.fan_local_promotion_word_of_mouth}</Text>
              </View>
            )}
            {profile?.fan_pre_release_demo_feedback && (
              <View style={styles.serviceCard}>
                <Text style={styles.cardTitle}>Pre-Release & Demo-Feedback</Text>
                <Text style={styles.cardDetail}>{profile.fan_pre_release_demo_feedback}</Text>
              </View>
            )}
            {profile?.fan_volunteer_event_crew_support && (
              <View style={styles.serviceCard}>
                <Text style={styles.cardTitle}>Freiwillige Event-Hilfe (Crew-Support)</Text>
                <Text style={styles.cardDetail}>{profile.fan_volunteer_event_crew_support}</Text>
              </View>
            )}
          </View>

          <View style={styles.footerDark}>
            <Text>STREET-TEAM & PROMOTION</Text>
            <Text>PAGE 03</Text>
          </View>
        </View>

        {/* Rechts: Gallery & Stamm-Locations */}
        <View style={styles.halfRightDark}>
          <View>
            <View style={styles.sectionHeaderDark}>
              <Text style={styles.h2Dark}>Live Gallery</Text>
              <Text style={styles.tagDark}>03 // COMMUNITY</Text>
            </View>

            {galleryImages.length > 0 && (
              <View style={styles.grid2x2}>
                {galleryImages.slice(0, 4).map((img, i) => (
                  <Image key={i} src={img.url} style={styles.gridCellImg} />
                ))}
              </View>
            )}

            <Text style={{ fontSize: 7.5, color: '#fbbf24', letterSpacing: 1.5, marginTop: 4, marginBottom: 3 }}>
              STAMM-LOCATIONS & NETZWERK
            </Text>
            <Text style={{ fontSize: 8.5, color: '#d4d4d8', lineHeight: 1.35 }}>
              {profile?.fan_regular_venues || 'Tanz Arena Kirchdorf, lokale Kulturhäuser & Festivalgelände in OÖ/Bayern'}
            </Text>
          </View>

          <View style={styles.footerDark}>
            <Text>GALLERY & VENUES</Text>
            <Text>PAGE 03</Text>
          </View>
        </View>
      </Page>

      {/* =========================================================
          SEITE 4: COMMUNITY & INVITATIONS
         ========================================================= */}
      <Page size="A4" orientation="landscape" style={styles.pageLight}>
        {/* Links: VIP-Programme & Einladungen */}
        <View style={styles.halfLeftLight}>
          <View>
            <View style={styles.sectionHeaderLight}>
              <Text style={styles.h2Light}>Invitations</Text>
              <Text style={styles.tagLight}>04 // COMMUNITY</Text>
            </View>

            <Text style={styles.bodyText}>
              Kooperationsmöglichkeiten für Bands, Veranstalter und Locations im GIGSDA-Netzwerk:
            </Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              <View style={styles.perkBox}>
                <Text style={styles.factLabel}>Gästeliste & Showcases</Text>
                <Text style={[styles.factValue, { fontSize: 8.5, marginTop: 2, lineHeight: 1.3 }]}>
                  {profile?.fan_networking_guest_list_invitations || 'Offen für Club-Gigs, Showcases & Release-Partys'}
                </Text>
              </View>
              <View style={styles.perkBox}>
                <Text style={styles.factLabel}>VIP-Pässe & Meet & Greet</Text>
                <Text style={[styles.factValue, { fontSize: 8.5, marginTop: 2, lineHeight: 1.3 }]}>
                  {profile?.fan_vip_passes_support_programs || 'Early-Bird-Pässe, Demo-Feedback & Merch-Support'}
                </Text>
              </View>
            </View>

            <View style={{ backgroundColor: '#f4f4f5', padding: 8, borderLeftWidth: 3, borderLeftColor: '#000000' }}>
              <Text style={styles.factLabel}>Community-Aktivitäten & Socials</Text>
              <Text style={{ fontSize: 8.5, color: '#27272a', marginTop: 2, lineHeight: 1.4 }}>
                {profile?.fan_community_activities || 'Social-Media-Sharing, Flyer-Support, Konzert-Carpooling & Merch-Stand-Hilfe.'}
              </Text>
            </View>
          </View>

          <View style={styles.footerLight}>
            <Text>COMMUNITY & INVITATIONS</Text>
            <Text>PAGE 04</Text>
          </View>
        </View>

        {/* Rechts: Direct Supporter Contact */}
        <View style={styles.halfRightDark}>
          <View>
            <Text style={{ fontSize: 8, color: '#fbbf24', letterSpacing: 2, marginBottom: 4 }}>
              DIRECT SUPPORTER NETWORK
            </Text>
            <Text style={[styles.h2Dark, { fontSize: 24, marginBottom: 12 }]}>
              Direct Contact
            </Text>
            <Text style={{ fontSize: 9, color: '#a1a1aa', lineHeight: 1.5, marginBottom: 20 }}>
              Für Gästelisten-Einladungen, Pre-Release-Hörproben, Street-Team-Einsätze oder Carpooling-Absprachen:
            </Text>

            <View style={{ borderTopWidth: 1, borderTopColor: '#27272a', paddingTop: 12 }}>
              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 7.5, color: '#71717a', letterSpacing: 1.5 }}>SUPPORTER & REGION</Text>
                <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#ffffff', marginTop: 2 }}>
                  {fanName}<br />
                  {profile?.plz} {profile?.city}
                </Text>
              </View>

              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 7.5, color: '#71717a', letterSpacing: 1.5 }}>E-MAIL</Text>
                <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#ffffff', marginTop: 2 }}>
                  {profile?.email || 'fanny@hilft.at'}
                </Text>
              </View>

              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 7.5, color: '#71717a', letterSpacing: 1.5 }}>SOCIAL KANÄLE</Text>
                <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#fbbf24', marginTop: 2 }}>
                  {profile?.fan_social_channels || 'Instagram, Spotify, YouTube'}
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

export function DownloadFanPdfButton({ profile, references }) {
  const fanName = profile?.Klarname || profile?.name || 'Fan';
  const safeName = fanName
    .replace(/[^a-zA-Z0-9äöüÄÖÜß_-]/g, '_')
    .replace(/_+/g, '_');

  return (
    <PDFDownloadLink
      document={<FanPortfolioDocument profile={profile} references={references} />}
      fileName={`${safeName}_Supporter_Pass.pdf`}
      className="px-4 py-1.5 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-amber-400 transition"
    >
      {({ loading }) => (loading ? 'Generiere PDF...' : 'Supporter-PDF herunterladen')}
    </PDFDownloadLink>
  );
}