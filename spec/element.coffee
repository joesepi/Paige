bescribe = require "../bescribe"
{expect} = require "chai"

config =
  address: "http://www.example.com"
  webdriver:
    address: "http://localhost:4444/wd/hub"
    config:
      platform: "MAC"
      browserName: "firefox"

bescribe "WebElement", config, (context, describe, it) ->
  describe "#getXPath", ->
    it "resolves with the XPath for the given element", ->
      context.Page.build()
      .find('a')
      .getXPath()
      .then((xpath) ->
        expect(xpath).to.equal("/html/body/div/p[2]/a")
      )

  describe "#getCssProperties", ->
    it "resolves with the computed styles for the given element", ->
      context.Page.build()
      .find('a')
      .getCssProperties()
      .then((styles) ->
        expect(styles.width).to.equal("auto")
      )

  describe "#hover", ->
    describe "when given a css selector", ->
      it "executes without errors", ->
        context.Page.build()
        .find('a')
        .hover()

  describe "#unhover", ->
    describe "when given a css selector", ->
      it "executes without errors", ->
        page = context.Page.build()

        page.find('a')
        .hover()
        .then(->
          page.find('a')
          .unhover()
        )

  describe "#clickable", ->
    it "returns true when element is clickable", ->
      context.Page.build()
      .find("a").clickable()
      .then((clickable) ->
        expect(clickable).to.be.true
      )

    it "returns false when element is not clickable", ->
      page = context.Page.build()

      page.runOnPage("document.querySelector('a').setAttribute('disabled', 'disabled')")
      .then(->
        page.find("a").clickable()
        .then((clickable) ->
          expect(clickable).to.be.false
        )
      )
