import { pb } from '$lib/pb';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

interface Horaire {
  id: string;
  Jour: string;
  heure: string;
}


export const load: PageServerLoad = async () => {
  try {
    const Horaires = await pb.collection('Horaire').getFullList<Horaire>({
      sort: 'Jour' // Ordre alphabétique : boissons, dejeuner, diner
    });
    
    return { Horaires };
  } catch (error) {
    console.error('Erreur chargement menus:', error);
    return { Horaires: [] };
  }
};

export const actions: Actions = {
  update: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    
    try {
      await pb.collection('Horaire').update(id, formData);
      return { success: true, message: 'Horaires mis à jour !' };
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      return fail(400, { error: true, message: 'Erreur lors de la mise à jour' });
    }
  }
};