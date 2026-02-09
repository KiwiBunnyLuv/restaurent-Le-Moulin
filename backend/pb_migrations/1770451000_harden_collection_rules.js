/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const adminRule = '@request.auth.id != "" && @request.auth.collectionName = "cms_admins"'

  const siteSettings = app.findCollectionByNameOrId("pbc_1244924877")
  const horaire = app.findCollectionByNameOrId("pbc_3808439220")
  const media = app.findCollectionByNameOrId("pbc_1621831907")
  const promotions = app.findCollectionByNameOrId("pbc_1542849396")
  const menu = app.findCollectionByNameOrId("pbc_4198167069")
  const contactMessages = app.findCollectionByNameOrId("pbc_2969642415")

  unmarshal({
    "createRule": adminRule,
    "deleteRule": adminRule,
    "listRule": "",
    "updateRule": adminRule,
    "viewRule": ""
  }, siteSettings)

  unmarshal({
    "createRule": adminRule,
    "deleteRule": adminRule,
    "listRule": "",
    "updateRule": adminRule,
    "viewRule": ""
  }, horaire)

  unmarshal({
    "createRule": adminRule,
    "deleteRule": adminRule,
    "listRule": "",
    "updateRule": adminRule,
    "viewRule": ""
  }, media)

  unmarshal({
    "createRule": adminRule,
    "deleteRule": adminRule,
    "listRule": "",
    "updateRule": adminRule,
    "viewRule": ""
  }, promotions)

  unmarshal({
    "createRule": adminRule,
    "deleteRule": adminRule,
    "listRule": "",
    "updateRule": adminRule,
    "viewRule": ""
  }, menu)

  unmarshal({
    "createRule": "",
    "deleteRule": adminRule,
    "listRule": adminRule,
    "updateRule": adminRule,
    "viewRule": adminRule
  }, contactMessages)

  app.save(siteSettings)
  app.save(horaire)
  app.save(media)
  app.save(promotions)
  app.save(menu)
  return app.save(contactMessages)
}, (app) => {
  const siteSettings = app.findCollectionByNameOrId("pbc_1244924877")
  const horaire = app.findCollectionByNameOrId("pbc_3808439220")
  const media = app.findCollectionByNameOrId("pbc_1621831907")
  const promotions = app.findCollectionByNameOrId("pbc_1542849396")
  const menu = app.findCollectionByNameOrId("pbc_4198167069")
  const contactMessages = app.findCollectionByNameOrId("pbc_2969642415")

  unmarshal({
    "createRule": "",
    "deleteRule": "",
    "listRule": "",
    "updateRule": "",
    "viewRule": ""
  }, siteSettings)

  unmarshal({
    "createRule": "",
    "deleteRule": "",
    "listRule": "",
    "updateRule": "",
    "viewRule": ""
  }, horaire)

  unmarshal({
    "createRule": "",
    "deleteRule": "",
    "listRule": "",
    "updateRule": "",
    "viewRule": ""
  }, media)

  unmarshal({
    "createRule": "",
    "deleteRule": "",
    "listRule": "",
    "updateRule": "",
    "viewRule": ""
  }, promotions)

  unmarshal({
    "createRule": "",
    "deleteRule": "",
    "listRule": "",
    "updateRule": "",
    "viewRule": ""
  }, menu)

  unmarshal({
    "createRule": "",
    "deleteRule": "",
    "listRule": "",
    "updateRule": "",
    "viewRule": ""
  }, contactMessages)

  app.save(siteSettings)
  app.save(horaire)
  app.save(media)
  app.save(promotions)
  app.save(menu)
  return app.save(contactMessages)
})
