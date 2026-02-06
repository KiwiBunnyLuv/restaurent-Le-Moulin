import { pb } from '$lib/pb';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';

// LOAD FUNCTION - Récupère les données au chargement de la page
export const load: PageServerLoad = async () => {
  try {
    // Récupère le premier enregistrement avec key="main"
    const settings = await pb.collection('Site_Settings')
      .getFirstListItem('key="main"');
    
    return { settings };
  } catch (error) {
    console.error('Erreur chargement settings:', error);
    return { settings: null };
  }
};

// ACTIONS - Gère la soumission du formulaire
export const actions: Actions = {
  update: async ({ request }) => {
    const formData = await request.formData();
    
    const id = formData.get('id') as string;
    const siteName = formData.get('siteName') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const address = formData.get('address') as string;
    const social_instagram = formData.get('instagram') as string;
    const facebook = formData.get('facebook') as string;
    const googleMaps = formData.get('googleMaps') as string;
    const logo = formData.get('logo') as File;

    try {
      // Prépare les données à mettre à jour
      const updateData: Record<string, any> = {
        siteName,
        phone,
        email,
        address,
        social_instagram,
        facebook,
        googleMaps
      };

      // Si un nouveau logo est uploadé
      if (logo && logo.size > 0) {
        updateData.logo = logo;
      }

      // Met à jour l'enregistrement dans Pocketbase
      await pb.collection('Site_Settings').update(id, updateData);

      return { success: true, message: 'Paramètres mis à jour avec succès!' };
    } catch (error) {
      console.error('Erreur mise à jour:', error);
      return fail(400, { 
        error: true, 
        message: 'Erreur lors de la mise à jour' 
      });
    }
  }
};