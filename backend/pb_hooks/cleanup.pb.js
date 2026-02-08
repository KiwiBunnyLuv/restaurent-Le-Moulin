onRecordAfterCreateRequest((e) => {
  const collection = e.collection.name;
  
  if (collection === "ta_collection") {
    // Récupère tous les enregistrements
    const records = $app.dao().findRecordsByExpr(collection, null, {
      sort: "-created"
    });

    // Supprime tout après les 20 premiers
    if (records.length > 20) {
      for (let i = 20; i < records.length; i++) {
        $app.dao().deleteRecord(records[i]);
      }
    }
  }
}, "ta_collection");

