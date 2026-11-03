
import ProfileMap from './maps/ProfileMap';
     
     
export default function ProfileMapBox({ profile }) {

  if (!profile) return null;
  if (
    profile.show_stamm === false ||
    profile.show_address === false ||
    profile.show_street === false ||
    profile.show_plz === false ||
    profile.show_city === false
  ) return null;
  if (!profile.street && !profile.city && !profile.plz) return null;

  return (

    <section className="rounded-3xl bg-slate-950 border border-slate-800 p-8">
      <h2 className="text-2xl font-bold mb-6">
        📍 Standort & Anfahrt
      </h2>

      <div className="space-y-2">
        <div className="font-bold text-cyan-400">
          {profile?.show_Klarname === false ? '' : profile?.Klarname}
        </div>

        <div>{profile?.street}</div>

        <div>
          {profile?.plz} {profile?.city}
        </div>

        <a
          href={`https://www.google.com/maps?q=${profile?.lat},${profile?.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-xl"
        >
          Route planen
        </a>
{/*
        <div className="mt-6 rounded-2xl overflow-hidden border border-slate-800">
          <iframe
            src={`https://maps.google.com/maps?q=${profile?.lat},${profile?.lng}&z=15&output=embed`}
            width="100%"
            height="300"
            className="border-0"
            loading="lazy"
          />
        </div>
*/}
        <ProfileMap
          center={{
            lat: profile?.lat,
            lng: profile?.lng,
          }}
        />

      </div>




    </section>
  );
}
