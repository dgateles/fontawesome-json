process.env.CHROME_PATH = "C:/chrome-win/chrome.exe"; // The place of Chrome on you system
process.env.NICKJS_PROXY = ""; // NickJS proxy
process.env.http_proxy = ""; // Env proxy
const url = 'https://fontawesome.com/cheatsheet';
const fs = require('fs');
const Nick = require("nickjs")
const nick = new Nick({
  headless: false
})

;
(async () => {
  const tab = await nick.newTab()
  await tab.open(url)
  await tab.untilVisible("main") // Make sure we have loaded the page
  const iconsList = await tab.evaluate((arg, callback) => {
    // Here we're in the page context. It's like being in your browser's inspector tool
    var groups = {};
    var sections = window.document.getElementsByClassName('cheatsheet-set');
    for (const section of sections) {
      const names = [];
      groups[section.id] = names;
      var icons = section.getElementsByClassName('icon');
      for (const icon of icons) {
        const name = icon.getElementsByTagName('dd')[0].innerText;
        if (section.id === 'solid') {
          names.push('fas fa-' + name);
        } else if (section.id === 'regular') {
          names.push('far fa-' + name);
        } else if (section.id === 'brands') {
          names.push('fab fa-' + name);
        }
      }

    };
    callback(null, groups)
  })
  await fs.writeFileSync('fontawesome.json', JSON.stringify(iconsList, null, 4), (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
})()
.then(() => {
    console.log("Json Generated Successfully!")
    nick.exit()
  })
  .catch((err) => {
    console.log(`Something went wrong: ${err}`)
    nick.exit(1)
  })
