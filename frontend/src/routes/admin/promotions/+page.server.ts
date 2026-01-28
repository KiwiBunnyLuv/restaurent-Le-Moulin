import { pb } from '$lib/pb';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

// Interface TypeScript pour une promotion
interface Promotion {
  id: string;
  titre: string;
  description: string;
  prix: number;
  image?: string;
}

// LOAD : Récupère toutes les promotions au chargement de la page
export const load: PageServerLoad = async () => {
  try {
    const promotions = await pb.collection('Promotions').getFullList<Promotion>({
      sort: '-created' // Les plus récentes en premier
    });
    
    return { promotions };
  } catch (error) {
    console.error('Erreur chargement promotions:', error);
    return { promotions: [] };
  }
};

// ACTIONS : Gère les formulaires (créer, supprimer, modifier)
export const actions: Actions = {
  // Action pour CRÉER une promotion
  create: async ({ request }) => {
    const formData = await request.formData();
    
    try {
      await pb.collection('Promotions').create(formData);
      return { success: true, message: 'Promotion créée !' };
    } catch (error) {
      console.error('Erreur création:', error);
      return fail(400, { error: true, message: 'Erreur lors de la création' });
    }
  },

  // Action pour SUPPRIMER une promotion
  delete: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    
    try {
      await pb.collection('Promotions').delete(id);
      return { success: true, message: 'Promotion supprimée !' };
    } catch (error) {
      console.error('Erreur suppression:', error);
      return fail(400, { error: true, message: 'Erreur lors de la suppression' });
    }
  },

  // Action pour MODIFIER une promotion
  update: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    
    try {
      await pb.collection('Promotions').update(id, formData);
      return { success: true, message: 'Promotion mise à jour !' };
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      return fail(400, { error: true, message: 'Erreur lors de la mise à jour' });
    }
  }
};