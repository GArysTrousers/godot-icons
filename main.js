import { copyFileSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";

let templates = {
  page: readFileSync('./templates/index.html').toString(),
  icon: readFileSync('./templates/icon.html').toString(),
}

let iconNames = readdirSync("./icons")

// arg: --clean will reset all tags 
let icons = process.argv.includes('--clean') ? {} : JSON.parse(readFileSync('./data/tags.json'))

// add any new icons
for (const filename of iconNames) {
  let name = filename.match(/(.+)\.svg$/i)
  if (name) {
    if (!(icons.hasOwnProperty(name[1]))) {
      console.log('Added Icon:', name[1]);
      icons[name[1]] = name[1].toLocaleLowerCase()
    }
  }
}

// generate page (HTML)
let page = templates.page.replace(/{{icons}}/, () => {
  return Object.entries(icons)
    .map(([filename, tags]) => (
      templates.icon
        .replace(/{{filename}}/g, filename)
        .replace(/{{tags}}/g, tags.toLowerCase())
    ))
    .reduce((a, b) => (a + b))
})


mkdirSync('./build/icons', { recursive: true })
writeFileSync('./build/index.html', page)
writeFileSync('./data/tags.json', JSON.stringify(icons, null, 2))
for (const filename of iconNames) {
  copyFileSync('./icons/' + filename, './build/icons/' + filename)
}

console.log("Build Successful: ./build");