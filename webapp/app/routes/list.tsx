import Layout from '~/components/Layout';
import SongList from '~/components/SongList';
import PdfSettingsDialog from '~/components/PdfSettingsDialog';
import { readLocalePatch, folderSongs } from '~/utils.server';
import { json, LoaderFunction, useLoaderData } from 'remix';
import { getSession } from '~/session.server';

export let loader: LoaderFunction = async ({ request, params }) => {
  const session = await getSession(request.headers.get('Cookie'));
  try {
    const patch = await readLocalePatch();
    const locale = session.get('locale') as string;
    if (!locale) {
      throw new Error('Locale not provided');
    }
    const songs = folderSongs.getSongsMeta(locale, patch);
    return json({
      songs,
    });
  } catch (err) {
    console.log(err);
    return json({ locale: '', songs: [] });
  }
};

const List = () => {
  const { songs } = useLoaderData();

  return (
    <Layout title="Buscador">
      <SongList songs={songs} />
      <PdfSettingsDialog />
    </Layout>
  );
};

export default List;