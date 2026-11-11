/* YMKF_MEDIA_ARCHIVE_SOURCE_V1
 * Authoritative watched-works source.
 * The sync script injects this file into index.html on every RUN_SYNC.
 * Update this file through the YMKF media-archive update workflow; do not hand-edit generated index.html.
 */
(function () {
  'use strict';
  if (window.__YMKF_MEDIA_ARCHIVE_V1) return;
  window.__YMKF_MEDIA_ARCHIVE_V1 = true;
  window.YMKF_MEDIA_ARCHIVE_VERSION = '1.0.0';

  const WORKS={"animation":{"title":"动画","groups":{"中":["昨日青空","小蝌蚪找妈妈","猪猪侠","熊出没","小鲤鱼历险记","小鸡不好惹","喜羊羊与灰太狼","开心超人","葫芦兄弟","黑猫警长","果宝特攻","电击小子","大头儿子小头爸爸","哪吒二"],"美":["寻梦环游记","心灵奇旅","睡美人","狮子王","灰姑娘","海底总动员","怪兽电力公司","怪兽大学","疯狂动物城","飞屋环游记","超能陆战队","白雪公主与七个小矮人","阿拉丁","成龙历险记","驯龙高手","玩具总动员","神偷奶爸","赛车总动员","米老鼠和唐老鸭","猫和老鼠","加菲猫","海绵宝宝","怪物史莱克","功夫熊猫","疯狂原始人","冰雪奇缘"],"日":["言叶之庭","想哭的我戴上了猫的面具","天气之子","声之形","你好世界","你的名字","秒速五厘米","借东西的小人阿莉埃蒂","蓝精灵","悠哉日常大王","樱花庄的宠物女孩","小城日常","五等分的花嫁","我的青春恋爱物语果然有问题","我的妹妹不可能那么可爱","花开伊吕波","国家队","孤独摇滚","工作细胞","哆啦A梦","吹响吧！上低音号","测不准的阿波连同学","冰菓","别当欧尼酱了","埃罗芒阿老师","未闻花名","徒然喜欢你","赛马娘","日常","轻音少女","青春猪头少年","路人女主的养成方法","龙与虎","凉宫春日","恋爱禁止的世界","莉可丽丝","堀与宫村","家有女友","CLANNAD","罪恶王冠","租借女友","紫罗兰永恒花园","中二病也要谈恋爱","月色真美","约会大作战","缘之空","玉子市场","游戏人生"]}},"manga":{"title":"漫画","groups":{"作品":["我的女友棒极啦","爆笑校园","怦然心动"]}},"tv":{"title":"电视剧","groups":{"中":["爱情公寓","夏至未至","神犬小七","亲爱的，热爱的","小别离","欢乐颂","99分女友","少年派","人民的名义","西游记","红楼梦","水浒传","三国演义"]}},"movies":{"title":"电影","groups":{"中":["霸王别姬","滚蛋吧！肿瘤君","长城","战狼2","唐人街探案2","捉妖记2","你好，李焕英","银河补习班","长津湖","年会不能停！","第二十条"],"外":["饥饿站台","肖生克的救赎","泰坦尼克号","我，机器人","变形金钢","至暗时刻","百万英镑"]}},"books":{"title":"读物","groups":{"书架":["西游记","红楼梦","水浒传","三国演义","王子与贫儿","老人与海","朝花夕拾","呐喊","红脖子","少年维特之烦恼","河豚少年","平凡的世界","生死场","她认出来风暴","红星照耀中国","三字经","弟子规","论语","子夜","影子人","红岩","海底两万里","鲁滨逊漂流记","昆虫记","伊索寓言","骆驼祥子","繁星·春水","钢铁是怎样炼成的","格列弗游记","童年·在人间·我的大学","汤姆·索亚历险记","爱的教育","简·爱","星星离我们有多远","徐志摩诗全集","欧·亨利短篇小说集","复活","城南旧事","沙乡年鉴","苏菲的世界","三体","呼兰河传","湘行散记","苏东坡传","牧羊少年奇幻之旅","草房子","根鸟","第七条猎狗","狼王梦","白洋淀纪事","朱自清散文全集","荷塘月色","飞鸟集","新月集","百万英镑","最后一头战象","魔法诱惑","傅雷家书","名人传","叶圣陶佳作选","寂静的春天","长征","摆渡人","追风筝的人","木偶奇遇记"]}}};
  const SPECS = [
    ['animation', '动画'],
    ['manga', '漫画'],
    ['tv', '电视剧'],
    ['movies', '电影'],
    ['books', '读物']
  ];

  function palette(name) {
    let h = 0;
    for (const c of name) h = (h * 31 + c.charCodeAt(0)) % 360;
    return [
      'hsl(' + h + ' 36% 32%)',
      'hsl(' + ((h + 48) % 360) + ' 28% 13%)'
    ];
  }

  function thumb(name, type, group) {
    const suffix = type === 'books' ? ' 书籍 封面' :
      type === 'manga' ? ' 漫画 封面' :
      type === 'tv' ? ' 电视剧 海报' :
      type === 'movies' ? ' 电影 海报' :
      (group === '日' ? ' 动漫 官方 海报' : ' 动画 官方 海报');
    return 'https://tse1.mm.bing.net/th?q=' +
      encodeURIComponent(name + suffix) +
      '&w=720&h=540&c=7&rs=1&p=0&dpr=1&pid=1.7';
  }

  function addStyles() {
    if (document.getElementById('ymkf-media-archive-style-v1')) return;
    const style = document.createElement('style');
    style.id = 'ymkf-media-archive-style-v1';
    style.textContent = `
      .topbar .head{min-width:0}
      .topbar .right{min-width:0}
      .topbar .tabs{overflow-x:auto!important;overflow-y:hidden!important;scrollbar-width:none;white-space:nowrap;max-width:min(74vw,760px)}
      .topbar .tabs::-webkit-scrollbar{display:none}
      .topbar .tab{flex:0 0 auto}
      #works.media-page{padding-bottom:28px}
      .media-top{padding-top:28px}
      .works-nav{display:flex;gap:8px;flex-wrap:wrap;margin:0 0 24px}
      .work-tab{padding:9px 17px;border:1px solid var(--line);border-radius:999px;background:transparent;color:var(--muted);cursor:pointer;font:inherit;font-size:14px}
      .work-tab[aria-pressed=true]{background:var(--text);color:var(--bg);border-color:var(--text)}
      .works-library{padding-bottom:8px}
      .works-group-head{display:flex;justify-content:space-between;align-items:center;margin:22px 2px 10px}
      .works-group-head h3{margin:0;font-size:14px}
      .works-group-head span{font-size:11px;color:var(--muted)}
      .works-grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px}
      .work-card{aspect-ratio:4/3;min-width:0;border:1px solid var(--line);border-radius:14px;overflow:hidden;background:var(--surface);display:grid;grid-template-rows:minmax(0,1fr) 40px;box-shadow:0 5px 16px rgba(0,0,0,.08);transition:transform .16s,border-color .16s,box-shadow .16s}
      .work-card:hover{transform:translateY(-2px);border-color:var(--muted);box-shadow:0 8px 22px rgba(0,0,0,.14)}
      .work-art{min-height:0;position:relative;background:linear-gradient(145deg,var(--wc1),var(--wc2));overflow:hidden}
      .work-art img{width:100%;height:100%;display:block;object-fit:cover}
      .work-title{display:flex;align-items:center;justify-content:center;text-align:center;padding:0 8px;font-size:11px;line-height:1.35;overflow:hidden}
      .work-title span{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;overflow-wrap:anywhere}
      .books-note{letter-spacing:.01em;margin:18px 2px 0;color:var(--muted);font-size:11px;line-height:1.5}
      @media(max-width:900px){.works-grid{grid-template-columns:repeat(4,minmax(0,1fr))}}
      @media(max-width:680px){.works-grid{grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.work-card{border-radius:11px;grid-template-rows:minmax(0,1fr) 38px}.work-title{padding:0 7px;font-size:10px}}
      @media(max-width:470px){.works-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
    `;
    document.head.appendChild(style);
  }

  function renderCategory(host, type) {
    const data = WORKS[type];
    if (!data) throw new Error('YMKF media archive category missing: ' + type);
    host.innerHTML = '';
    for (const [group, items] of Object.entries(data.groups)) {
      const section = document.createElement('section');
      if (group && group !== '作品' && group !== '书架') {
        const head = document.createElement('div');
        head.className = 'works-group-head';
        const h = document.createElement('h3');
        h.textContent = group;
        head.appendChild(h);
        section.appendChild(head);
      }
      const grid = document.createElement('div');
      grid.className = 'works-grid';
      for (const name of items) {
        const colors = palette(name);
        const card = document.createElement('article');
        card.className = 'work-card';
        card.style.setProperty('--wc1', colors[0]);
        card.style.setProperty('--wc2', colors[1]);

        const art = document.createElement('div');
        art.className = 'work-art';
        const img = document.createElement('img');
        img.alt = name;
        img.loading = 'lazy';
        img.referrerPolicy = 'no-referrer';
        img.src = thumb(name, type, group);
        img.onerror = function () { this.style.display = 'none'; };
        art.appendChild(img);

        const title = document.createElement('div');
        title.className = 'work-title';
        const span = document.createElement('span');
        span.textContent = name;
        title.appendChild(span);
        card.append(art, title);
        grid.appendChild(card);
      }
      section.appendChild(grid);
      host.appendChild(section);
    }
    if (type === 'books') {
      const note = document.createElement('p');
      note.className = 'books-note';
      note.textContent = '各种刊物/普及教育类丛书不计';
      host.appendChild(note);
    }
  }

  function activateTop(id, tabs, shell) {
    tabs.querySelectorAll('.tab').forEach(function (button) {
      const active = button.dataset.page === id;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    shell.querySelectorAll(':scope > main.page').forEach(function (page) {
      page.classList.toggle('active', page.id === id);
    });
  }

  function install() {
    const tabs = document.querySelector('.topbar .tabs');
    const shell = document.querySelector('.shell');
    const gamePage = document.getElementById('games');
    if (!tabs || !shell || !gamePage) throw new Error('YMKF media archive: homepage shell or games page not found.');

    ['videos', 'animation', 'anime', 'tv', 'movies', 'manga', 'books', 'works'].forEach(function (id) {
      const old = document.getElementById(id);
      if (old && old !== gamePage) old.remove();
    });

    const worksPage = document.createElement('main');
    worksPage.id = 'works';
    worksPage.className = 'page media-page';
    worksPage.innerHTML =
      '<section class="intro media-top"><div><h1>已阅作品</h1></div></section>' +
      '<nav class="works-nav" aria-label="作品分类"></nav>' +
      '<div class="works-library"></div>';

    const nav = worksPage.querySelector('.works-nav');
    const host = worksPage.querySelector('.works-library');
    SPECS.forEach(function (spec, index) {
      const id = spec[0];
      const label = spec[1];
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'work-tab';
      button.textContent = label;
      button.setAttribute('aria-pressed', String(index === 0));
      button.addEventListener('click', function () {
        nav.querySelectorAll('.work-tab').forEach(function (tab) {
          tab.setAttribute('aria-pressed', String(tab === button));
        });
        renderCategory(host, id);
      });
      nav.appendChild(button);
    });

    const footer = shell.querySelector('.footer');
    shell.insertBefore(worksPage, footer || null);
    renderCategory(host, 'animation');

    tabs.innerHTML = '';
    [['games', '游戏战绩'], ['works', '已阅作品']].forEach(function (item) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'tab';
      button.dataset.page = item[0];
      button.textContent = item[1];
      button.addEventListener('click', function () {
        activateTop(item[0], tabs, shell);
      });
      tabs.appendChild(button);
    });
    activateTop('games', tabs, shell);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', install, { once: true });
  } else {
    install();
  }
})();
