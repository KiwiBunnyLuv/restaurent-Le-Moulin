import { pb } from '$lib/pb';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

interface Menu {
  id: string;
  Categorie: string;
  image: string;
  pdf: string;
}

export const load: PageServerLoad = async () => {
  try {
    const menus = await pb.collection('Menu').getFullList<Menu>({
      sort: 'Categorie' // Ordre alphabétique : boissons, dejeuner, diner
    });
    
    return { menus };
  } catch (error) {
    console.error('Erreur chargement menus:', error);
    return { menus: [] };
  }
};

export const actions: Actions = {
  update: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    
    try {
      await pb.collection('Menu').update(id, formData);
      return { success: true, message: 'Menu mis à jour !' };
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      return fail(400, { error: true, message: 'Erreur lors de la mise à jour' });
    }
  }
};