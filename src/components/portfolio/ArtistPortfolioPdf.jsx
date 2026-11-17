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

// Editorial Magazin-Styles (A4 Querformat: 841.89 x 595.28 pt)
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
    marginVertical: 16
  },
  coverTitleBig: {
    fontSize: 38,
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
  waveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    gap: 3,
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
    backgroundColor: 'rgba(0,0,0,0.68)',
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
  coverArtistName: {
    fontSize: 36,
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
    marginBottom: 16
  },
  sectionHeaderDark: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderBottomWidth: 1,
    borderBottomColor: '#3f3f46',
    paddingBottom: 6,
    marginBottom: 16
  },
  h2Light: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: -0.5,
    color: '#000000'
  },
  h2Dark: {
    fontSize: 22,
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
    width: 115,
    height: 145,
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
    marginBottom: 6
  },
  factLabel: {
    fontSize: 7,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: '#71717a'
  },
  factValue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#111111',
    marginTop: 1
  },
  bodyText: {
    fontSize: 9,
    lineHeight: 1.5,
    color: '#27272a',
    marginBottom: 8
  },
  quoteText: {
    fontSize: 8.5,
    fontFamily: 'Helvetica-Oblique',
    lineHeight: 1.45,
    color: '#52525b',
    borderLeftWidth: 2,
    borderLeftColor: '#000000',
    paddingLeft: 8,
    marginTop: 4
  },
  wideStageImg: {
    width: '100%',
    height: 195,
    objectFit: 'cover',
    marginBottom: 18
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
  grid2x2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14
  },
  gridCellImg: {
    width: '48.5%',
    height: 112,
    objectFit: 'cover'
  },
  specGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16
  },
  specBox: {
    width: '47%',
    borderBottomWidth: 1,
    borderBottomColor: '#e4e4e7',
    paddingBottom: 6
  },
  backlineBox: {
    backgroundColor: '#f4f4f5',
    borderLeftWidth: 3,
    borderLeftColor: '#000000',
    padding: 10,
    marginTop: 6
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

// Das eigentliche 4-seitige PDF-Dokument
export function ArtistPortfolioDocument({ profile, references = [] }) {
  const heroImage = profile?.slide1_url || profile?.gallery_slot1_url;
  const galleryImages = [1, 2, 3, 4]
    .map(num => ({
      url: profile?.[`gallery_slot${num}_url`],
      title: profile?.[`gallery_slot${num}_title`] || `Live Impression 0${num}`
    }))
    .filter(item => Boolean(item.url));

  const albums = [1, 2, 3, 4, 5]
    .map(albumNum => {
      const cover = profile?.[`album${albumNum}_cover`];
      const title = profile?.[`album${albumNum}_title`];
      const tracks = [1, 2, 3, 4]
        .map(trackNum => {
          const name =
            albumNum === 1
              ? profile?.[`audio${trackNum}_name`]
              : profile?.[`album${albumNum}_track${trackNum}_name`];
          const url =
            albumNum === 1
              ? profile?.[`audio${trackNum}_url`]
              : profile?.[`album${albumNum}_track${trackNum}_url`];
          return url ? name || `Track 0${trackNum}` : null;
        })
        .filter(Boolean);

      if (!cover && !title && tracks.length === 0) return null;
      return { albumNum, cover, title: title || `Release 0${albumNum}`, tracks };
    })
    .filter(Boolean);

  const waveHeights = [10, 22, 34, 15, 28, 36, 18, 12, 30, 24, 14, 32, 16, 9, 26, 20];

  return (
    <Document title={`${profile?.name || 'Artist'} - Musical Portfolio`}>
      {/* =========================================================
          SEITE 1: EDITORIAL COVER (A4 Querformat)
         ========================================================= */}
      <Page size="A4" orientation="landscape" style={styles.pageDark}>
        <View style={styles.coverSpine}>
          <View style={styles.coverHeaderRow}>
            <Text>GIGSDA // {profile?.id || 'ARTIST'}</Text>
            <Text>PRESSKIT</Text>
          </View>

          <View style={styles.coverTypoBlock}>
            <Text style={styles.coverTitleBig}>MUSICAL</Text>
            <Text style={styles.coverSubtitle}>PORTFOLIO</Text>

            {/* Vektor-Soundwave */}
            <View style={styles.waveRow}>
              {waveHeights.map((h, i) => (
                <View
                  key={i}
                  style={{
                    width: 2.5,
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
            <Text style={styles.coverGenre}>{profile?.genre || 'Live Artist'}</Text>
            <Text style={styles.coverMeta}>
              {profile?.city ? `${profile.city} • ` : ''}
              {profile?.formation || 'Solo / Live Act'}
            </Text>
          </View>
        </View>

        <View style={styles.coverHero}>
          {heroImage && <Image src={heroImage} style={styles.coverHeroImg} />}
          <View style={styles.coverOverlay}>
            <Text style={styles.coverCategory}>
              {profile?.category || 'Musiker / Live Performance'}
            </Text>
            <Text style={styles.coverArtistName}>{profile?.name}</Text>
            {profile?.description && (
              <Text style={styles.coverTeaser}>{profile.description}</Text>
            )}
          </View>
        </View>
      </Page>

      {/* =========================================================
          SEITE 2: PROFILE & CONTENTS (Heller Magazin-Kontrast)
         ========================================================= */}
      <Page size="A4" orientation="landscape" style={styles.pageLight}>
        {/* Links: Biografie & Facts */}
        <View style={styles.halfLeftLight}>
          <View>
            <View style={styles.sectionHeaderLight}>
              <Text style={styles.h2Light}>Profile</Text>
              <Text style={styles.tagLight}>01 // BIOGRAPHY</Text>
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
                  <Text style={styles.factLabel}>Act / Artist</Text>
                  <Text style={styles.factValue}>{profile?.name || '-'}</Text>
                </View>
                <View style={styles.factItem}>
                  <Text style={styles.factLabel}>Genre & Stil</Text>
                  <Text style={styles.factValue}>{profile?.genre || '-'}</Text>
                </View>
                <View style={styles.factItem}>
                  <Text style={styles.factLabel}>Standort</Text>
                  <Text style={styles.factValue}>{profile?.city || '-'}</Text>
                </View>
                <View style={styles.factItem}>
                  <Text style={styles.factLabel}>Formation</Text>
                  <Text style={styles.factValue}>{profile?.formation || '-'}</Text>
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
              <Text style={styles.quoteText}>{profile.bio_privates}</Text>
            )}
            {!profile?.bio_einleitung && !profile?.bio_karriere && profile?.description && (
              <Text style={styles.bodyText}>{profile.description}</Text>
            )}
          </View>

          <View style={styles.footerLight}>
            <Text>{profile?.name}</Text>
            <Text>PAGE 02</Text>
          </View>
        </View>

        {/* Rechts: Bühnenbild & Inhaltsverzeichnis */}
        <View style={styles.halfRightLight}>
          <View>
            {(galleryImages[1]?.url || heroImage) && (
              <Image
                src={galleryImages[1]?.url || heroImage}
                style={styles.wideStageImg}
              />
            )}

            <View style={styles.sectionHeaderLight}>
              <Text style={[styles.h2Light, { fontSize: 18 }]}>Contents</Text>
              <Text style={styles.tagLight}>INDEX</Text>
            </View>

            <View style={styles.tocRow}>
              <Text style={styles.tocTitle}>01. Artist Profile & Story</Text>
              <Text style={styles.tocPage}>P. 02</Text>
            </View>
            <View style={styles.tocRow}>
              <Text style={styles.tocTitle}>02. Discography & Repertoire</Text>
              <Text style={styles.tocPage}>P. 03</Text>
            </View>
            <View style={styles.tocRow}>
              <Text style={styles.tocTitle}>03. Live Performances & Credits</Text>
              <Text style={styles.tocPage}>P. 03</Text>
            </View>
            <View style={styles.tocRow}>
              <Text style={styles.tocTitle}>04. Stage Specs & Booking</Text>
              <Text style={styles.tocPage}>P. 04</Text>
            </View>
          </View>

          <View style={styles.footerLight}>
            <Text>AGENCY PORTFOLIO</Text>
            <Text>PAGE 02</Text>
          </View>
        </View>
      </Page>

      {/* =========================================================
          SEITE 3: DISCOGRAPHY & PERFORMANCES (Dark Contrast)
         ========================================================= */}
      <Page size="A4" orientation="landscape" style={styles.pageDark}>
        {/* Links: Discography */}
        <View style={styles.halfLeftDark}>
          <View>
            <View style={styles.sectionHeaderDark}>
              <Text style={styles.h2Dark}>Discography</Text>
              <Text style={styles.tagDark}>02 // SOUND</Text>
            </View>

            {albums.length > 0 ? (
              albums.slice(0, 3).map(album => (
                <View
                  key={album.albumNum}
                  style={{
                    flexDirection: 'row',
                    gap: 10,
                    marginBottom: 14,
                    borderBottomWidth: 1,
                    borderBottomColor: '#27272a',
                    paddingBottom: 10
                  }}
                >
                  {album.cover && (
                    <Image
                      src={album.cover}
                      style={{ width: 54, height: 54, objectFit: 'cover' }}
                    />
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 7, color: '#fbbf24', letterSpacing: 1.5 }}>
                      RELEASE 0{album.albumNum}
                    </Text>
                    <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#ffffff', marginBottom: 4 }}>
                      {album.title}
                    </Text>
                    {album.tracks.map((t, idx) => (
                      <Text key={idx} style={{ fontSize: 8.5, color: '#a1a1aa', marginBottom: 1.5 }}>
                        0{idx + 1}. {t}
                      </Text>
                    ))}
                  </View>
                </View>
              ))
            ) : (
              <View style={{ padding: 14, backgroundColor: '#18181b', borderWidth: 1, borderColor: '#27272a' }}>
                <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: '#ffffff', marginBottom: 4 }}>
                  Live- & Studio-Repertoire
                </Text>
                <Text style={{ fontSize: 9, color: '#a1a1aa', lineHeight: 1.45 }}>
                  Spieldauer bis zu {profile?.duration_max || 90} Minuten ({profile?.genre || 'Rock / Metal'}).
                  Hörproben und Live-Mitschnitte sind direkt im digitalen GIGSDA-Profil abrufbar.
                </Text>
              </View>
            )}
          </View>

          <View style={styles.footerDark}>
            <Text>AUDIO & RELEASES</Text>
            <Text>PAGE 03</Text>
          </View>
        </View>

        {/* Rechts: Performances & Referenzen */}
        <View style={styles.halfRightDark}>
          <View>
            <View style={styles.sectionHeaderDark}>
              <Text style={styles.h2Dark}>Performances</Text>
              <Text style={styles.tagDark}>03 // LIVE</Text>
            </View>

            {galleryImages.length > 0 && (
              <View style={styles.grid2x2}>
                {galleryImages.slice(0, 4).map((img, i) => (
                  <Image key={i} src={img.url} style={styles.gridCellImg} />
                ))}
              </View>
            )}

            <Text style={{ fontSize: 8, color: '#fbbf24', letterSpacing: 1.5, marginBottom: 6 }}>
              SELECTED SHOWS & GIGSDA REFERENCES
            </Text>
            {references.length > 0 ? (
              references.slice(0, 5).map(ref => (
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
                    {ref.title}
                  </Text>
                  <Text style={{ fontSize: 8, color: '#a1a1aa' }}>{ref.date}</Text>
                </View>
              ))
            ) : (
              <Text style={{ fontSize: 8.5, color: '#a1a1aa', lineHeight: 1.45 }}>
                Verfügbar für Club-Shows, Festivals, Support-Slots und exklusive Event-Produktionen.
              </Text>
            )}
          </View>

          <View style={styles.footerDark}>
            <Text>LIVE & CREDITS</Text>
            <Text>PAGE 03</Text>
          </View>
        </View>
      </Page>

      {/* =========================================================
          SEITE 4: STAGE SPECS & BOOKING CONTACT
         ========================================================= */}
      <Page size="A4" orientation="landscape" style={styles.pageLight}>
        {/* Links: Tech & Stage Specs */}
        <View style={styles.halfLeftLight}>
          <View>
            <View style={styles.sectionHeaderLight}>
              <Text style={styles.h2Light}>Stage & Tech</Text>
              <Text style={styles.tagLight}>04 // RIDER</Text>
            </View>

            <View style={styles.specGrid}>
              <View style={styles.specBox}>
                <Text style={styles.factLabel}>Hauptinstrument</Text>
                <Text style={styles.factValue}>{profile?.mainInstrument || '-'}</Text>
              </View>
              <View style={styles.specBox}>
                <Text style={styles.factLabel}>Nebeninstrumente</Text>
                <Text style={styles.factValue}>{profile?.subInstruments || '-'}</Text>
              </View>
              <View style={styles.specBox}>
                <Text style={styles.factLabel}>Formation</Text>
                <Text style={styles.factValue}>{profile?.formation || '-'}</Text>
              </View>
              <View style={styles.specBox}>
                <Text style={styles.factLabel}>Max. Spieldauer</Text>
                <Text style={styles.factValue}>
                  {profile?.duration_max ? `${profile.duration_max} Min.` : '-'}
                </Text>
              </View>
              <View style={styles.specBox}>
                <Text style={styles.factLabel}>Changeover / Check</Text>
                <Text style={styles.factValue}>
                  {profile?.setup_time ? `${profile.setup_time} Min.` : '-'}
                </Text>
              </View>
              <View style={styles.specBox}>
                <Text style={styles.factLabel}>Monitoring</Text>
                <Text style={styles.factValue}>{profile?.rider_monitors || '-'}</Text>
              </View>
            </View>

            {profile?.rider_backline && (
              <View style={styles.backlineBox}>
                <Text style={styles.factLabel}>Backline & Strombedarf</Text>
                <Text style={[styles.factValue, { marginTop: 3 }]}>{profile.rider_backline}</Text>
              </View>
            )}
          </View>

          <View style={styles.footerLight}>
            <Text>PRODUCTION & SOUND</Text>
            <Text>PAGE 04</Text>
          </View>
        </View>

        {/* Rechts: Booking Contact (Dunkel abgesetzt) */}
        <View style={styles.halfRightDark}>
          <View>
            <Text style={{ fontSize: 8, color: '#fbbf24', letterSpacing: 2, marginBottom: 4 }}>
              DIRECT BOOKING & MANAGEMENT
            </Text>
            <Text style={[styles.h2Dark, { fontSize: 24, marginBottom: 12 }]}>
              Booking Contact
            </Text>
            <Text style={{ fontSize: 9, color: '#a1a1aa', lineHeight: 1.5, marginBottom: 20 }}>
              Für Booking-Anfragen, Festival-Slots, Agentur-Kooperationen und Presseinformationen wenden Sie sich bitte direkt an:
            </Text>

            <View style={{ borderTopWidth: 1, borderTopColor: '#27272a', paddingTop: 12 }}>
              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 7.5, color: '#71717a', letterSpacing: 1.5 }}>E-MAIL</Text>
                <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#ffffff', marginTop: 2 }}>
                  {profile?.email || '-'}
                </Text>
              </View>

              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 7.5, color: '#71717a', letterSpacing: 1.5 }}>TELEFON</Text>
                <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#ffffff', marginTop: 2 }}>
                  {profile?.phone || '-'}
                </Text>
              </View>

              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 7.5, color: '#71717a', letterSpacing: 1.5 }}>WEB / GIGSDA</Text>
                <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#fbbf24', marginTop: 2 }}>
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

// Fertiger Download-Button für deine Action-Bar in ArtistPortfolio.jsx
export function DownloadPortfolioPdfButton({ profile, references }) {
  const safeName = (profile?.name || 'Artist')
    .replace(/[^a-zA-Z0-9äöüÄÖÜß_-]/g, '_')
    .replace(/_+/g, '_');

  return (
    <PDFDownloadLink
      document={<ArtistPortfolioDocument profile={profile} references={references} />}
      fileName={`${safeName}_Musical_Portfolio.pdf`}
      className="px-4 py-1.5 bg-white text-black text-xs font-bold uppercase tracking-wider hover:bg-amber-400 transition"
    >
      {({ loading }) => (loading ? 'Generiere PDF...' : 'Agentur-PDF herunterladen')}
    </PDFDownloadLink>
  );
}