import React from 'react';
import GigsdaPass from "../GigsdaPass";
import { eventService } from '../../services/eventService';
import PortfolioActionBar from './shared/PortfolioActionBar';

export default function ArtistPortfolio({
  profile,
  onBack = null,
  setView
}) {


const loggedInProfileId =
  localStorage.getItem('gigsda_profile_id');

const isOwner =
  String(loggedInProfileId) === String(profile?.id);
	
	const handlePrintPdf = () => {
		window.print();
		};

		const events =
		eventService.getEvents();

		const references =
			events.filter(evt => {
				const hasJoined =
					Array.isArray(evt.crew) &&
					evt.crew.some(member =>
						member &&
						member.name === profile?.name &&
						(
							member.status === "accepted" ||
							member.status === "confirmed"
						)
					);
				const isOwner =
					evt.ownerId === profile?.id;
				return hasJoined || isOwner;
			});


		if (!profile) {
			return null;
		}

console.log(profile);

	return (
		<div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
			
			{/* 01 // HERO STAGE */}
				<section className="relative overflow-hidden rounded-3xl border border-cyan-500/20 bg-slate-950">
						<div className="relative h-[550px] overflow-hidden">
						<img
						src={profile?.slide1_url}
						alt="Hero"
						className="w-full h-full object-cover"
						/>
						<div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/20" />
						</div>


						<div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

						<div className="absolute bottom-0 left-0 p-10">
								<p className="text-cyan-400 tracking-[0.8em] uppercase text-sm">
								Gigsda Portfolio
								</p>

								<h1 className="text-5xl font-bold mt-2">
								{profile?.name}
								</h1>

								<p className="text-slate-300 mt-3 text-lg">
								{profile?.category}
								</p>

								<p className="text-slate-400 mt-2">
								{profile?.genre}
								</p>


								<PortfolioActionBar
										profile={profile}
										isOwner={isOwner}
										setView={setView}
								/>
								
						</div>
				</section>

				{/* WHY THIS ARTIST */}
				<section className="grid md:grid-cols-3 gap-6">
				<div className="rounded-3xl bg-slate-950 border border-slate-800 p-6">
						<h3 className="font-bold mb-2">🎵 Live Performance</h3>
						<p className="text-slate-400">
						Authentische Musik mit eigenem Stil.
						</p>
				</div>

				<div className="rounded-3xl bg-slate-950 border border-slate-800 p-6">
						<h3 className="font-bold mb-2">🎤 Live Erfahrung</h3>
						<p className="text-slate-400">
						Bühnenpräsenz und Livemusik.
						</p>
				</div>

				<div className="rounded-3xl bg-slate-950 border border-slate-800 p-6">
						<h3 className="font-bold mb-2">🤝 Direkt buchbar</h3>
						<p className="text-slate-400">
						Transparent und unkompliziert.
						</p>
				</div>
				</section>

				{/* SNAPSHOT */}
				<section className="rounded-3xl bg-slate-950 border border-slate-800 p-8">
				<h2 className="text-2xl font-bold mb-8">
						Artist Snapshot
				</h2>

				<div className="grid md:grid-cols-2 gap-8">

						<div className="space-y-4">
						<p>
						<strong>Genre:</strong> {profile?.genre || "-"}
						</p>

						<p>
						<strong>Standort:</strong> {profile?.city || "-"}
						</p>

						<p>
						<strong>Formation:</strong> {profile?.formation || "-"}
						</p>
						</div>

						<div>
						<p className="text-slate-400 leading-relaxed">
						{profile?.description || "Keine Beschreibung vorhanden."}
						</p>
						</div>

				</div>
				</section>

				{/* MEDIA SHOWCASE */}
				<section className="rounded-3xl bg-slate-950 border border-slate-800 p-8">

					<h2 className="text-2xl font-bold mb-8">
						Media Showcase
					</h2>

					<div className="space-y-8">

						{[1,2,3,4,5].map(albumNum => {

							const cover =
								profile?.[`album${albumNum}_cover`];

							const title =
								profile?.[`album${albumNum}_title`];

							if (!cover && !title) return null;

							return (

								<div
									key={albumNum}
									className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden"
								>

									{cover ? (
										<img
											src={cover}
											alt={title}
											className="w-full h-64 object-cover"
										/>
									) : (
										<div className="w-full h-64 bg-slate-800 flex items-center justify-center text-slate-500">
											Kein Cover vorhanden
										</div>
									)}

									<div className="p-6">

										<h3 className="text-2xl font-bold mb-6">
											{title}
										</h3>

										<div className="space-y-4">

											{[1,2,3,4].map(trackNum => {

												let trackName;
												let trackUrl;

												if (albumNum === 1) {

													trackName =
														profile?.[`audio${trackNum}_name`];

													trackUrl =
														profile?.[`audio${trackNum}_url`];

												} else {

													trackName =
														profile?.[`album${albumNum}_track${trackNum}_name`];

													trackUrl =
														profile?.[`album${albumNum}_track${trackNum}_url`];

												}

												if (!trackUrl) return null;

												return (

													<div
														key={trackNum}
														className="rounded-xl border border-slate-800 p-4"
													>

														<div className="mb-3">

															<span className="text-cyan-400 text-xs uppercase tracking-wider">
																Track {trackNum}
															</span>

															<h4 className="font-semibold mt-1">
																{trackName}
															</h4>

														</div>

														<audio
															controls
															className="w-full"
														>
															<source
																src={trackUrl}
																type="audio/mpeg"
															/>
														</audio>

													</div>

												);

											})}

										</div>

									</div>

								</div>

							);

						})}

					</div>

				</section>


				{/* GALLERY */}
				<section className="rounded-3xl bg-slate-950 border border-slate-800 p-8">
				<h2 className="text-2xl font-bold mb-8">
						Visual Gallery
				</h2>
				<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
						{[1, 2, 3, 4].map((num) => {
						const image = profile?.[`gallery_slot${num}_url`];
						const title = profile?.[`gallery_slot${num}_title`];
						if (!image) return null;
						return (
								<div
								key={num}
								className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-900"
								>
								<img src={image} alt={title} className="w-full h-full object-cover" />
								<div className="p-4">
										<p className="text-sm text-slate-300">
										{title}
										</p>
								</div>
								</div>
						);
						})}
				</div>
				</section>


				{/* BOOKING CENTER */}
				<section className="rounded-3xl bg-slate-950 border border-slate-800 p-8">

				<h2 className="text-2xl font-bold mb-8">
						Booking Center
				</h2>

				<div className="grid md:grid-cols-3 gap-6">
						<div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
						<h3 className="font-semibold mb-3">
								E-Mail
						</h3>

						<p>{profile?.email}</p>
						</div>

						<div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
						<h3 className="font-semibold mb-3">
								Telefon
						</h3>

						<p>{profile?.phone}</p>
						</div>

						<div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
						<h3 className="font-semibold mb-3">
								Webseite
						</h3>
						<p>{profile?.website}</p>
						</div>
				</div>
				</section>


				{/* ARTIST STORY */}
				<section className="rounded-3xl bg-slate-950 border border-slate-800 p-8">

				<h2 className="text-2xl font-bold mb-8">
						Artist Story
				</h2>

				<div className="grid lg:grid-cols-3 gap-6">

						<div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
								<h3 className="font-semibold mb-4">
								Einleitung
								</h3>

								<p className="text-slate-300 leading-relaxed">
										{profile?.bio_einleitung || "Keine Einleitung vorhanden."}
								</p>
						</div>

						<div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
								<h3 className="font-semibold mb-4">
										Karriere
								</h3>
								<p className="text-slate-300 leading-relaxed">
										{profile?.bio_karriere || "Keine Karriereinformationen vorhanden."}
								</p>
						</div>

						<div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
								<h3 className="font-semibold mb-4">
										Persönliches
								</h3>

								<p className="text-slate-300 leading-relaxed">
										{profile?.bio_privates || "Keine weiteren Informationen vorhanden."}
								</p>
						</div>

				</div>

				</section>


				{/* REFERENCES */}
				<section className="rounded-3xl bg-slate-950 border border-slate-800 p-8">

				<h2 className="text-2xl font-bold mb-8">
						References
				</h2>

				<div className="rounded-2xl bg-slate-900 border border-slate-800 p-8">

						<h3 className="text-xl font-semibold mb-4">
						Aktuelle Projekte & Engagements
						</h3>

						<p className="text-slate-400 leading-relaxed">
						Referenzen werden automatisch aus GIGSDA Projekten und Events
						generiert. Alle Veranstaltungen, Produktionen und Engagements,
						bei denen ein Künstler, Crew-Mitglied oder Veranstalter beteiligt
						ist, erscheinen hier automatisch.
						</p>

						<div className="mt-6 border-t border-slate-800 pt-6">

						<p className="text-cyan-400 font-mono text-sm">
								REFERENZSYSTEM AKTIV
						</p>

						{references.length > 0 ? (
						<div className="space-y-2 mt-4">
								{references.map(ref => (
								<div
										key={ref.id}
										className="rounded-xl bg-slate-950 border border-slate-800 p-3"
								>
										<div className="font-semibold text-white">
										{ref.title}
										</div>

										<div className="text-slate-400 text-sm">
										{ref.date}
										</div>
								</div>
								))}
						</div>
						) : (
						<p className="text-slate-500 text-sm mt-2">
								Noch keine automatisch erkannten Referenzen vorhanden.
						</p>
						)}

						</div>

				</div>

				</section>


				{/* TECH OVERVIEW */}
				<section className="rounded-3xl bg-slate-950 border border-slate-800 p-8">

				<h2 className="text-2xl font-bold mb-8">
						Tech Overview
				</h2>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
						<div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
						<h3 className="font-semibold mb-3">Formation</h3>
						<p>{profile?.formation}</p>
						</div>

						<div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
						<h3 className="font-semibold mb-3">Hauptinstrument</h3>
						<p>{profile?.mainInstrument}</p>
						</div>

						<div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
						<h3 className="font-semibold mb-3">Nebeninstruments</h3>
						<p>{profile?.subInstruments}</p>
						</div>

						<div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
						<h3 className="font-semibold mb-3">Showdauer</h3>
						<p>{profile?.duration_max} Minuten</p>
						</div>

						<div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
						<h3 className="font-semibold mb-3">Setup / Check</h3>
						<p>{profile?.setup_time} Minuten</p>
						</div>

						<div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
						<h3 className="font-semibold mb-3">Monitoring</h3>
						<p>{profile?.rider_monitors}</p>
						</div>

				</div>

				</section>


				{/* TECHNICAL RIDER */}
				<section className="rounded-3xl bg-slate-950 border border-slate-800 p-8">

					<h2 className="text-2xl font-bold mb-8">
							Technical Rider
					</h2>

					<div className="grid md:grid-cols-2 gap-6">

							<div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
							<h3 className="font-semibold mb-4">
									Technical Rider PDF
							</h3>

									<a
									href={profile?.rider_pdf_url}
									target="_blank"
									rel="noopener noreferrer"
									className="text-cyan-400 hover:text-cyan-300 underline break-all"
									>
									📄 Rider öffnen
									</a>
							</div>

							<div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
							<h3 className="font-semibold mb-4">
									Stageplot
							</h3>

							<a
									href={profile?.stageplot_url}
									target="_blank"
									rel="noopener noreferrer"
									className="text-cyan-400 hover:text-cyan-300 underline break-all"
							>
									🗺️ Stageplot öffnen
							</a>
							</div>

							<div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
							<h3 className="font-semibold mb-4">
									Monitoring
							</h3>

							<p className="text-slate-300">
									{profile?.rider_monitors}
							</p>
							</div>

							<div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
							<h3 className="font-semibold mb-4">
									Backline
							</h3>

							<p className="text-slate-300">
									{profile?.rider_backline}
							</p>
							</div>

					</div>

				</section>


				{/* FÜR VERANSTALTER ODER AGENCY */}
				<section className="rounded-3xl bg-slate-950 border border-slate-800 p-8">

					<h2 className="text-2xl font-bold mb-8">
							Für Veranstalter oder Agency
					</h2>

					<div className="grid md:grid-cols-2 gap-6">

							<div className="rounded-2xl bg-slate-900 border border-slate-800 p-6">
							<h3 className="font-semibold mb-4">
									Printinfo als PDF öffnen
							</h3>
								<a
									href="/profiles/Artist Portfolio - Winston Jud.pdf"
									target="_blank"
									rel="noopener noreferrer"
									className="text-cyan-400 hover:text-cyan-300 underline"
								>
									📄 Portfolio PDF öffnen
								</a>
							</div>

					</div>
				</section>

				{/* GIGSDAPASS - NUR FÜR OWNER */}
				{isOwner && (
				<GigsdaPass 
					profile={profile}
					/>
				)}

		</div>
	);
}