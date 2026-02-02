import { pb } from '$lib/pb';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

interface Media {
    id: string;
    file: string;
    alt: string;
    order: number;
}

export const load: PageServerLoad = async () => {
  try {
    const Media = await pb.collection('Media').getFullList<Media>({
      sort: 'order' // Ordre alphabétique : boissons, dejeuner, diner
    });

    return { Media };
  } catch (error) {
    console.error('Erreur chargement menus:', error);
    return { Media: [] };
  }
};

export const actions: Actions = {
  update: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    
    try {
      await pb.collection('Media').update(id, formData);
      return { success: true, message: 'Media mis à jour !' };
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      return fail(400, { error: true, message: 'Erreur lors de la mise à jour' });
    }
  }
};
