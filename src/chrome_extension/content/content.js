import './css/general.scss'
import './css/header.scss'
import './css/content.scss'
import './css/nav.scss'
import './css/kemo.scss'

import language from './language.json';

const words = (() => {
  // Detect the language of the wiki page
  switch (/https:\/\/(.*?).wiki/.exec(document.URL)[1]) {
    case "en" : return language.en; break;
    case "jp" : return language.jp; break;
    default: return language.jp; break;
  }
})()

const sayRate = 0.3

const randomPick = list => list[Math.floor(Math.random() * list.length)]

const kemoInnerHTML = list => `<span class="kemo-say">＼${randomPick(list)}／</span>`

const japarizeWikipedia = () => {
  const headPattern = 'wikipedia'
  const contextPatterns = [
    'wikipedia',
    'ウィキペディア',
  ]
  const after = 'ジャパリ図書館'

  // document title
  document.title = document.title.replace(
    new RegExp(`${headPattern}$`, 'i'),
    after
  )

  // search props
  const searchInput = document.getElementById('searchInput')
  const props = ['placeholder', 'title']
  const searchRegex = new RegExp(headPattern, 'i')
  props.forEach((prop) => {
    searchInput[prop] = searchInput[prop].replace(searchRegex, after)
  })

  // text content
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  )

  let n
  const contextRegex = new RegExp(`(${contextPatterns.join('|')})`, 'gi')
  while ((n = walker.nextNode())) {
    n.textContent = n.textContent.replace(contextRegex, after)
  }
}

const japarizeHeader = () => {
  document
  .querySelectorAll('.mw-headline, #mw-panel h3')
  .forEach(el => (el.textContent = words.titlemin + el.textContent))
}

const becomeFriendWithSectionTitle = () => {
  const head = document.getElementById('firstHeading')
  head.textContent = [
    randomPick(words.exHeadList),
    randomPick(words.preHeadList),
    head.textContent,
    randomPick(words.postHeadList),
  ].join(' ')
}

const insertWordsInContent = () => {
  document
  .querySelectorAll('#mw-content-text > p')
  .forEach((para) => {
    let sentence = para.innerHTML.match(/(.+?[。]|.+?\. )(?!([^<]+)?>)/g)
    if (!sentence) {
      return
    }

    const last = sentence.length - 1
    sentence = sentence
    .map((s, i) => (
      (i !== last && Math.random() < sayRate)
        ? s + ' ' + kemoInnerHTML(words.postPeriodList)
        : s
      )
    )

    if (Math.random() < sayRate) {
      sentence.push(' ' + kemoInnerHTML(words.postParaList))
    }

    para.innerHTML = sentence.join('')
  })
}

export default () => {
  japarizeWikipedia()
  japarizeHeader()
  becomeFriendWithSectionTitle()
  insertWordsInContent()
}
