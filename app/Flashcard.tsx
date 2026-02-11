"use client";

import React, { useState, useEffect } from 'react';

// --- 全50問データ ---
const WORLD_HERITAGE_DATA = [
  { "id": 1, "question": "Q1. 「北海道・北東北の縄文遺跡群」において、約1万5,000年前に土器を使用し、農耕以前に定住を確立した生業の基盤は何と定義されているか。\n\n(A) 焼畑農業と採集\n(B) 採集・漁労・狩猟\n(C) 稲作と家畜飼育\n(D) 大陸との交易と青銅器生産", "answer": "正解：(B)\n\n【解説】冷温帯落葉広葉樹の森林と豊かな海洋資源を持続的に管理することで、定住社会を1万年以上維持した点が評価されています。\n\n【ヒント】縄文時代が「農耕」に移行しなかった点に注目しましょう。" },
  { "id": 2, "question": "Q2. 縄文遺跡群の構成資産のうち、北東アジア最古級の土器が発見され、「定住の開始（ステージIa）」を示す遺跡はどれか。\n\n(A) 三内丸山遺跡\n(B) 大平山元遺跡\n(C) 大船遺跡\n(D) 北黄金貝塚", "answer": "正解：(B)\n\n【解説】移動に適さない煮沸用の土器が発見されたことは、特定の場所へ定着したことを示す決定的な証拠です。\n\n【ヒント】青森県にあり、旧石器から縄文への過渡期を示す遺跡です。" },
  { "id": 3, "question": "Q3. 三内丸山遺跡（青森県）において、祭祀・儀礼が長期間行われたことを証明する、土器や祭祀具が堆積した遺構は何か。\n\n(A) 環状列石\n(B) 大規模な盛土\n(C) 周堤墓\n(D) 貝塚", "answer": "正解：(B)\n\n【解説】盛土からは大量の土偶や祭祀用の道具が出土しており、自然崇拝や祖先崇拝が継続されていたことを示しています。\n\n【ヒント】三内丸山を象徴する、土を積み上げた巨大な遺構です。" },
  { "id": 4, "question": "Q4. 「平泉」の登録基準（ii）において、大陸由来の仏教建築・作庭思想と融合したとされる、日本固有の要素はどれか。\n\n(A) 寝殿造の建築美\n(B) 日本古来の水辺の祭祀場の理念や意匠\n(C) 禅宗の石組技術\n(D) 山岳信仰の修験道", "answer": "正解：(B)\n\n【解説】大陸の浄土思想が、日本が古くから持っていた自然への考え方と融合し、独自の空間表現を生み出した点が評価されました。\n\n【ヒント】「水景」に対する日本独自の価値観が鍵となります。" },
  { "id": 5, "question": "Q5. 平泉の浄土思想を視覚的に現出させるため、中尊寺や無量光院の配置の基準点となった周辺の山はどこか。\n\n(A) 束稲山\n(B) 金鶏山\n(C) 栗駒山\n(D) 姫神山", "answer": "正解：(B)\n\n【解説】金鶏山は平泉の都市計画の中心であり、無量光院から見て山頂に夕日が沈む際に浄土が現れるように計算されていました。\n\n【ヒント】黄金の鶏が埋められているという伝説がある山です。" },
  { "id": 6, "question": "Q6. 日光の社寺において、本殿と拝殿を連結する「権現造」を完成させたとされ、基準(iv)で評価されているのは東照宮ともう一つはどこか。\n\n(A) 輪王寺三仏堂\n(B) 輪王寺大猷院\n(C) 二荒山神社本社\n(D) 日光東照宮陽明門", "answer": "正解：(B)\n\n【解説】東照宮（家康）と大猷院（家光）の霊廟建築が、後の日本の神社建築の模範（規範）となったことが重要視されています。\n\n【ヒント】家光自身の霊廟建築を指します。" },
  { "id": 7, "question": "Q7. 徳川家光が自らの霊廟（大猷院）を、東照宮を凌がないよう「黒と金」を基調に控えめに設計させた背景にある思想（基準vi）は何か。\n\n(A) 徳川の平和と祖父への尊敬\n(B) 幕府の財政再建計画\n(C) 仏教の禁欲主義\n(D) 外国文化の排除", "answer": "正解：(A)\n\n【解説】家光の家康に対する深い崇拝の念が、建築の様式や色彩の選択に直接反映されている点が評価されています。\n\n【ヒント】基準(vi)は思想や出来事との密接な関わりを評価します。" },
  { "id": 8, "question": "Q8. 「富岡製糸場と絹産業遺産群」の4つの構成資産に含まれないものはどれか。\n\n(A) 田島弥平旧宅\n(B) 荒船風穴\n(C) 碓氷製糸\n(D) 高山社跡", "answer": "正解：(C)\n\n【解説】登録されているのは富岡製糸場、田島弥平旧宅、高山社跡、荒船風穴の4件で、絹産業のバリューチェーンを構成しています。\n\n【ヒント】「種の保存」に関わる風穴や、「教育」に関わる学校跡が含まります。" },
  { "id": 9, "question": "Q9. 富岡製糸場の建築に見られる、木材の骨組みにレンガをはめ込んだ日本独自の和洋折衷様式を何と呼ぶか。\n\n(A) 木骨レンガ造\n(B) 鉄筋コンクリート造\n(C) 漆喰土蔵造\n(D) 総レンガ造", "answer": "正解：(A)\n\n【解説】西洋のレンガ技術を日本の耐震性に適応させるために考案された、19世紀後半の優れた産業建築の事例です。\n\n【ヒント】木の「骨」とレンガの「壁」を組み合わせた名称です。" },
  { "id": 10, "question": "Q10. 「国立西洋美術館本館」を含むル・コルビュジエの建築作品が登録された際、評価された概念はどれか。\n\n(A) 持続可能な都市開発\n(B) 近代建築運動への顕著な貢献\n(C) 伝統的な石造建築の継承\n(D) 宗教的空間の再定義", "answer": "正解：(B)\n\n【解説】20世紀の社会のニーズに応えた新しい建築言語（ピロティ、屋上庭園など）が世界的に普及した点が評価されています。\n\n【ヒント】「7か国共同」での登録という点も特徴です。" },
  { "id": 11, "question": "Q11. 「富士山 — 信仰の対象と芸術の源泉」の登録基準（vi）において、評価の対象となった海外の芸術運動は何か。\n\n(A) ルネサンス\n(B) ジャポニスム\n(C) シュルレアリスム\n(D) バロック", "answer": "正解：(B)\n\n【解説】葛飾北斎らの浮世絵を通じて、富士山のイメージが西洋の印象派画家に多大な影響を与えたことが評価されています。\n\n【ヒント】19世紀後半、ヨーロッパで日本美術が流行したことを指します。" },
  { "id": 12, "question": "Q12. 富士山の構成資産のうち、富士講の人々が登拝の前に身を清めた「水行の場」とされる湧水池群はどれか。\n\n(A) 富士五湖\n(B) 忍野八海\n(C) 白糸ノ滝\n(D) 三保松原", "answer": "正解：(B)\n\n【解説】富士山の伏流水が湧き出る八つの池は、信仰と密接に結びついた巡礼の聖地として重要な役割を果たしました。\n\n【ヒント】「富士講」の歴史において欠かせない構成資産です。" },
  { "id": 13, "question": "Q13. 「白川郷・五箇山の合掌造り集落」において、急勾配の屋根を持つ建築様式が発達した最大の理由は。\n\n(A) 暴風対策と見栄え\n(B) 豪雪対策と屋根裏での養蚕スペース確保\n(C) 洪水時の浸水防止\n(D) 外敵からの防御", "answer": "正解：(B)\n\n【解説】多雪地帯の厳しい環境に適応しつつ、家内産業である養蚕や焔硝作りを効率化するために独自の進化を遂げました。\n\n【ヒント】雪の「落としやすさ」と内部の「広さ」の両立です。" },
  { "id": 14, "question": "Q14. 「古都京都の文化財」に含まれる構成資産の数は、現在いくつとされているか。\n\n(A) 12\n(B) 17\n(C) 20\n(D) 25", "answer": "正解：(B)\n\n【解説】京都市、宇治市、大津市に点在する、清水寺、金閣寺、比叡山延暦寺など合計17の社寺と城郭で構成されています。\n\n【ヒント】京都、宇治、大津の3市にまたがっています。" },
  { "id": 15, "question": "Q15. 京都の二条城が登録基準（i, ii, iv, vi）のうち、(vi)で評価されている歴史的出来事はどれか。\n\n(A) 鎌倉幕府の成立\n(B) 大政奉還\n(C) 応仁の乱\n(D) 遷都の儀式", "answer": "正解：(B)\n\n【解説】徳川幕府の終焉という、日本の近現代史を左右する決定的な出来事の舞台となったことが評価の根拠の一つです。\n\n【ヒント】二の丸御殿の大広間で行われた出来事です。" },
  { "id": 16, "question": "Q16. 「古都奈良の文化財」において、唯一「文化的景観」の要素を強く持つ、自然との一体化が評価された資産は。\n\n(A) 東大寺\n(B) 春日山原始林\n(C) 平城宮跡\n(D) 薬師寺", "answer": "正解：(B)\n\n【解説】春日大社の聖域として古くから狩猟・伐採が禁じられてきた原始林は、信仰が守り抜いた自然として高く評価されています。\n\n【ヒント】奈良公園の奥に広がる、1000年以上守られた森です。" },
  { "id": 17, "question": "Q17. 「法隆寺地域の仏教建造物」の登録基準において、(i)「人類の創造的才能を表す傑作」とされる主な理由は。\n\n(A) 日本初の鉄筋コンクリート建築\n(B) 世界最古の木造建造物群である点\n(C) 最大の石造建築群である点\n(D) 全てが金箔で覆われている点", "answer": "正解：(B)\n\n【解説】7世紀後半から8世紀初頭に遡る木造建築が、高い技術と芸術性を持って現存していることは世界的な奇跡です。\n\n【ヒント】五重塔や金堂の年代に注目しましょう。" },
  { "id": 18, "question": "Q18. 「紀伊山地の霊場と参詣道」において、融合したとされる2つの信仰形態はどれか。\n\n(A) 神道とキリスト教\n(B) 神道と仏教（神仏習合）\n(C) 儒教と道教\n(D) 禅と浄土宗", "answer": "正解：(B)\n\n【解説】山を神聖視する日本古来の自然崇拝（神道）が、大陸の仏教と深く融合した「修験道」の聖地であることが評価されました。\n\n【ヒント】吉野・大峯、熊野三山、高野山の3つの霊場が核です。" },
  { "id": 19, "question": "Q19. 「百舌鳥・古市古墳群」が2019年に登録された際、評価された歴史的意義は。\n\n(A) 稲作の広がりを証明\n(B) 古代日本の中央集権体制（倭王権）の確立を証明\n(C) 仏教伝来の様子を証明\n(D) 鉄器時代の終焉を証明", "answer": "正解：(B)\n\n【解説】4世紀後半から5世紀後半にかけて、巨大な前方後円墳が築かれたことは、強力な権力が存在した決定的な証拠です。\n\n【ヒント】仁徳天皇陵などの巨大な古墳群を指します。" },
  { "id": 20, "question": "Q20. 姫路城が「白鷺城」と呼ばれる由来であり、高度な耐火性を誇る壁の仕上げ方は何か。\n\n(A) 漆喰塗\n(B) 白漆喰塗籠（しろしっくいぬりこめ）\n(C) 石灰塗り\n(D) 泥壁", "answer": "正解：(B)\n\n【解説】外壁全体を厚い白漆喰で塗り固める技法は、美観だけでなく火矢や弾丸に対する防御力を高めています。\n\n【ヒント】姫路城の真っ白な姿を作る技術です。" },
  { "id": 21, "question": "Q21. 姫路城の大天守と小天守を「渡櫓（わたりやぐら）」で繋ぐ構造を何と呼ぶか。\n\n(A) 連結式天守\n(B) 連立式天守\n(C) 独立式天守\n(D) 複合式天守", "answer": "正解：(B)\n\n【解説】複数の天守を渡櫓で繋ぎ、中庭を形成する形式は、死角をなくし防御力を極大化させる最高峰の城郭構造です。\n\n【ヒント】「独立」「複合」「連結」との違いを整理しましょう。" },
  { "id": 22, "question": "Q22. 縄文遺跡群において、津軽海峡を挟んで共通の文化圏があったことを示す、北海道と東北で共通して出土する土器は。\n\n(A) 火焔型土器\n(B) 円筒土器\n(C) 隆起線文土器\n(D) 弥生土器", "answer": "正解：(B)\n\n【解説】円筒土器の分布は、当時すでに海を越えた活発な交流があったことを物語る重要な証拠です。\n\n【ヒント】「円筒下層」「円筒上層」といった分類があります。" },
  { "id": 23, "question": "Q23. 平泉の「無量光院跡」は、京都にあるどの寺院をモデルとして造営されたか。\n\n(A) 清水寺\n(B) 平等院鳳凰堂\n(C) 金閣寺\n(D) 東寺", "answer": "正解：(B)\n\n【解説】三代秀衡が平等院を模して建立。本堂の真後ろに金鶏山が位置するように設計されました。\n\n【ヒント】池の中島に阿弥陀堂を配する浄土建築の代表格です。" },
  { "id": 24, "question": "Q24. 日光東照宮の「五重塔」において、スカイツリーにも応用された耐震構造を何と呼ぶか。\n\n(A) 貫（ぬき）構造\n(B) 心柱懸垂式（しんばしらけんすいしき）\n(C) 積石構造\n(D) 浮き床構造", "answer": "正解：(B)\n\n【解説】中心の柱が地面に接しておらず、屋根から吊り下げられた状態で揺れを吸収する高度な制震技術です。\n\n【ヒント】中心の太い柱が「浮いている」のが特徴です。" },
  { "id": 25, "question": "Q25. 富岡製糸場のフランス人指導者ポール・ブリュナが、当初の工女たちを募集する際に重視したことは何か。\n\n(A) 賃金の安さ\n(B) 全国に技術を広める「指導者」としての教育\n(C) 外国語の習得\n(D) 織物技術の有無", "answer": "正解：(B)\n\n【解説】単なる労働者ではなく、技術を学び故郷に伝える「伝習工女」として、良家の子女が多く集まりました。\n\n【ヒント】官営模範工場としての役割を象徴しています。" },
  { "id": 26, "question": "Q26. ル・コルビュジエが提唱した「近代建築の五原則」に含まれないものはどれか。\n\n(A) ピロティ\n(B) 自由な平面\n(C) 組石造の厚い壁\n(D) 屋上庭園", "answer": "正解：(C)\n\n【解説】コルビュジエは、コンクリートを活用して「重い壁」から解放された自由な建築（ピロティ、水平連続窓など）を実現しました。\n\n【ヒント】「壁」から「柱」への構造変化が鍵です。" },
  { "id": 27, "question": "Q27. 富士山の構成資産「三保松原」が、山から離れているにもかかわらず登録された評価理由は。\n\n(A) 噴火の灰が堆積した場所だから\n(B) 富士山を遠望する名所として、多くの絵画や詩歌の題材となったため\n(C) 富士講の最初の宿泊地だから\n(D) 特殊な海生生物が住むから", "answer": "正解：(B)\n\n【解説】松原と富士山を組み合わせた景観は「日本の美」の象徴として定着しており、基準(vi)の芸術性を証明しています。\n\n【ヒント】歌川広重の浮世絵などにも描かれています。" },
  { "id": 28, "question": "Q28. 縄文遺跡群の「ステージIIIa」に分類される、環状列石が一直線に並ぶ秋田県の遺跡は。\n\n(A) 伊勢堂岱遺跡\n(B) 大湯環状列石\n(C) 小牧野遺跡\n(D) 大森勝山遺跡", "answer": "正解：(B)\n\n【解説】「万座」と「野中堂」の2つの環状列石があり、中心の石と日時計状組石が一直線に並ぶ配置が特徴です。\n\n【ヒント】日本を代表するストーンサークルの一つです。" },
  { "id": 29, "question": "Q29. 「古都奈良の文化財」の平城宮跡において、1998年の登録後に復元された、宮殿の正面にあたる巨大な門は。\n\n(A) 南大門\n(B) 朱雀門\n(C) 羅生門\n(D) 応天門", "answer": "正解：(B)\n\n【解説】平城宮の入り口として、また儀式の場として重要な役割を果たした門です。\n\n【ヒント】平城京のメインストリートである「朱雀大路」の北端に位置します。" },
  { "id": 30, "question": "Q30. 「紀伊山地の霊場と参詣道」のうち、真言密教の聖地として空海が開いた霊場はどこか。\n\n(A) 吉野・大峯\n(B) 熊野三山\n(C) 高野山\n(D) 伊勢神宮", "answer": "正解：(C)\n\n【解説】山上の盆地に一大宗教都市が築かれた、密教の根本道場です。\n\n【ヒント】壇上伽藍や奥之院が構成資産に含まれます。" },
  { "id": 31, "question": "Q31. 「百舌鳥・古市古墳群」の仁徳天皇陵古墳（大山古墳）の全長は、およそ何メートルか。\n\n(A) 200m\n(B) 350m\n(C) 486m\n(D) 600m", "answer": "正解：(C)\n\n【解説】世界最大級の墳墓であり、当時の倭王権の絶大な権力を象徴する規模を誇ります。\n\n【ヒント】エジプトのピラミッドや秦始皇帝陵と並び称されます。" },
  { "id": 32, "question": "Q32. 姫路城が1993年の登録時に認められた基準は、(i)と、あともう一つは何番か。\n\n(A) (ii)\n(B) (iii)\n(C) (iv)\n(D) (v)", "answer": "正解：(C)\n\n【解説】「木造城郭建築の最高傑作」である点と、17世紀初頭の「城郭システム」を完璧に保存している点が評価されました。\n\n【ヒント】(iv)は建築様式の顕著な見本であることを示します。" },
  { "id": 33, "question": "Q33. 白川郷の合掌造り家屋の「床下」で製造されていた、火薬の原料となる物質は。\n\n(A) 硫黄\n(B) 焔硝（えんしょう）\n(C) 燐\n(D) 木炭", "answer": "正解：(B)\n\n【解説】蚕の糞や土を混ぜ合わせて作る焔硝は、加賀藩を支える重要な軍需物資として村の経済を潤しました。\n\n【ヒント】山間部での貴重な現金収入源の一つでした。" },
  { "id": 34, "question": "Q34. 平泉の「中尊寺金色堂」を建立し、平泉の繁栄を築いた奥州藤原氏の初代は誰か。\n\n(A) 藤原清衡\n(B) 藤原基衡\n(C) 藤原秀衡\n(D) 藤原泰衡", "answer": "正解：(A)\n\n【解説】前九年・後三年の役という凄惨な戦争を経験した清衡が、平和への祈りを込めて建立しました。\n\n【ヒント】『供養願文』を認めた人物です。" },
  { "id": 35, "question": "Q35. 日光東照宮の「三猿」が彫られているのは、どの建物の外壁か。\n\n(A) 拝殿\n(B) 神厩舎（しんきゅうしゃ）\n(C) 陽明門\n(D) 経蔵", "answer": "正解：(B)\n\n【解説】猿は馬の守護神とされていたため、厩（うまや）の装飾として人間の一生が彫られました。\n\n【ヒント】馬が生活する場所、という言葉に注目しましょう。" },
  { "id": 36, "question": "Q36. 「富岡製糸場と絹産業遺産群」の構成資産「荒船風穴」が活用した、冷風を発生させる自然の仕組みは。\n\n(A) 湧水による冷却\n(B) 標高差による気温低下\n(C) 岩隙からの吹き出し冷風\n(D) 雪氷の貯蔵", "answer": "正解：(C)\n\n【解説】岩の隙間から吹き出す冷風を利用した天然の冷蔵庫で、繭の孵化時期を調整しました。\n\n【ヒント】「風穴（ふうけつ）」という名に由来があります。" },
  { "id": 37, "question": "Q37. 法隆寺の金堂や五重塔に見られる、中央部が膨らんだ柱の形状を何と呼ぶか。\n\n(A) 礎石\n(B) エンタシス\n(C) 貫\n(D) 垂木", "answer": "正解：(B)\n\n【解説】ギリシャのパルテノン神殿などにも見られる様式で、シルクロードを通じた文化の交流を象徴しています。\n\n【ヒント】視覚的に柱が真っ直ぐに見えるよう工夫された形状です。" },
  { "id": 38, "question": "Q38. 「古都京都の文化財」の中で、唯一「滋賀県」に位置する構成資産はどこか。\n\n(A) 延暦寺\n(B) 清水寺\n(C) 宇治上神社\n(D) 西芳寺", "answer": "正解：(A)\n\n【解説】比叡山延暦寺は滋賀県大津市に位置し、京都の鬼門を守る寺院として重要な役割を果たしてきました。\n\n【ヒント】「京都市、宇治市、大津市」の3市にまたがる遺産です。" },
  { "id": 39, "question": "Q39. 「古都奈良の文化財」の東大寺にある、世界最大の木造建築とされる建造物は。\n\n(A) 南大門\n(B) 大仏殿（金堂）\n(C) 二月堂\n(D) 正倉院", "answer": "正解：(B)\n\n【解説】江戸時代に再建された現在の建物は、創建時より規模が縮小されていますが、依然として世界最大級です。\n\n【ヒント】奈良の大仏を安置しているお堂です。" },
  { "id": 40, "question": "Q40. 「百舌鳥・古市古墳群」の古墳の形状において、日本列島で独自に発達した最も特徴的な形はどれか。\n\n(A) 円墳\n(B) 方墳\n(C) 前方後円墳\n(D) 帆立貝形古墳", "answer": "正解：(C)\n\n【解説】前方後円墳は日本の古墳時代の権力構造を象徴する、世界でも類を見ない独特の形状です。\n\n【ヒント】四角い部分と丸い部分が組み合わさっています。" },
  { "id": 41, "question": "Q41. 姫路城において、石垣を登る敵を攻撃するために壁に設けられた丸や三角の穴を何というか。\n\n(A) 石落\n(B) 狭間（さま）\n(C) 忍返し\n(D) 武者窓", "answer": "正解：(B)\n\n【解説】鉄砲や弓矢を射るための窓で、形状によって使い分けられていました。\n\n【ヒント】姫路城内には約1000個の「穴」が残っています。" },
  { "id": 42, "question": "Q42. 縄文遺跡群の「ステージIIIb」に分類される、眼部の表現が芸術的な「遮光器土偶」が出土した遺跡は。\n\n(A) 大船遺跡\n(B) 亀ヶ岡石器時代遺跡\n(C) 垣ノ島遺跡\n(D) 是川石器時代遺跡", "answer": "正解：(B)\n\n【解説】非常に精緻な装飾が施された遮光器土偶は、縄文後期の高い芸術性を証明しています。\n\n【ヒント】青森県つがる市にある、漆器なども多く出土した遺跡です。" },
  { "id": 43, "question": "Q43. 「紀伊山地の霊場と参詣道」のうち、阿弥陀浄土の入り口と信じられた「熊野参詣道」の別名は。\n\n(A) 中辺路（なかへち）\n(B) 小辺路\n(C) 蟻の熊野詣\n(D) 伊勢路", "answer": "正解：(C)\n\n【解説】身分を問わず多くの人々が列をなして巡礼した様子が、このように例えられました。\n\n【ヒント】参拝者の列が昆虫のように見えたことからそう呼ばれます。" },
  { "id": 44, "question": "Q44. ル・コルビュジエが設計した国立西洋美術館本館において、1階部分に壁を置かず柱だけで支える構造を何というか。\n\n(A) 自由な平面\n(B) ピロティ\n(C) 水平連続窓\n(D) 屋上庭園", "answer": "正解：(B)\n\n【解説】建築物を地面から浮かせることで、開放的な空間や通行路を生み出すコルビュジエの代名詞的な技法です。\n\n【ヒント】フランス語で「杭」を意味する言葉です。" },
  { "id": 45, "question": "Q45. 富士山の構成資産「白糸ノ滝」が、信仰との関わりで評価された主な理由は。\n\n(A) 富士講の開祖とされる角行が修行した地とされるため\n(B) 滝の中に神様が住むと信じられたため\n(C) 溶岩でできた唯一の滝だから\n(D) 天皇が訪れたから", "answer": "正解：(A)\n\n【解説】富士講の開祖・角行（かくぎょう）が修行を行った神聖な場所として、巡礼地の一つとなりました。\n\n【ヒント】富士信仰（富士講）における修行の聖地です。" },
  { "id": 46, "question": "Q46. 「富岡製糸場」において、繰糸機の動力を得るために採用された、西洋建築の力学を活用した屋根の骨組み構造は。\n\n(A) トラス構造\n(B) 切妻構造\n(C) 寄棟構造\n(D) 校倉構造", "answer": "正解：(A)\n\n【解説】三角形を基本としたトラス構造により、柱の少ない広大な作業空間を実現しました。\n\n【ヒント】大きな空間を支える、三角形の骨組みです。" },
  { "id": 47, "question": "Q47. 「古都奈良の文化財」の薬師寺において、唯一創建時（8世紀）から残る建造物は。\n\n(A) 金堂\n(B) 東塔\n(C) 西塔\n(D) 大講堂", "answer": "正解：(B)\n\n【解説】東塔は「凍れる音楽」と称されるほど優美な姿を持ち、奈良時代から唯一現存する貴重な塔です。\n\n【ヒント】薬師寺にある、大小の屋根（裳階）が重なる美しい塔です。" },
  { "id": 48, "question": "Q48. 京都の「平等院」が1994年の登録基準(vi)で評価されている、日本独自の仏教思想は。\n\n(A) 禅\n(B) 浄土思想（末法思想）\n(C) 密教\n(D) 法華経", "answer": "正解：(B)\n\n【解説】末法の世にあたり、阿弥陀如来の住む極楽浄土を現世に表現しようとした代表的な建築です。\n\n【ヒント】1052年（永承7年）に末法に入ると信じられた影響です。" },
  { "id": 49, "question": "Q49. 日光の二荒山神社にある、勝道上人が蛇の背を渡ったという伝説を持つ朱塗りの橋は。\n\n(A) 渡月橋\n(B) 神橋（しんきょう）\n(C) 蓬莱橋\n(D) 夢の浮橋", "answer": "正解：(B)\n\n【解説】日光の聖域の入り口を象徴する橋であり、伝説的な山岳信仰の起源を示しています。\n\n【ヒント】「二社一寺」の入り口に位置します。" },
  { "id": 50, "question": "Q50. 姫路城が2009年から行った大規模な保存修理プロジェクトの名称は。\n\n(A) 昭和の大修理\n(B) 平成の保存修理（平成の大修理）\n(C) 明治の再生\n(D) 令和の改修", "answer": "正解：(B)\n\n【解説】50年ぶりに行われた漆喰の塗り替えや瓦の修理など、現代の技術で真正性を守り抜く工事でした。\n\n【ヒント】「昭和」に続く、直近の大きな修理のことです。" }
];

// 配列をシャッフルするユーティリティ
const shuffle = (array: any[]) => [...array].sort(() => Math.random() - 0.5);

export default function WorldHeritageApp() {
  const [cards, setCards] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [weakPointIds, setWeakPointIds] = useState<number[]>([]);
  const [isReviewMode, setIsReviewMode] = useState(false);

  useEffect(() => {
    setCards(shuffle(WORLD_HERITAGE_DATA));
  }, []);

  const handleAnswer = (isCorrect: boolean) => {
    const currentCard = cards[currentIndex];
    if (!isCorrect) {
      setWeakPointIds(prev => Array.from(new Set([...prev, currentCard.id])));
    }
    const nextIndex = currentIndex + 1;
    if (nextIndex < cards.length) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(nextIndex), 150);
    } else {
      setShowResult(true);
    }
  };

  const resetNormal = () => {
    setCards(shuffle(WORLD_HERITAGE_DATA));
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowResult(false);
    setIsReviewMode(false);
    setWeakPointIds([]);
  };

  const startReview = () => {
    const weakCards = WORLD_HERITAGE_DATA.filter(card => weakPointIds.includes(card.id));
    setCards(shuffle(weakCards));
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowResult(false);
    setIsReviewMode(true);
    setWeakPointIds([]);
  };

  if (cards.length === 0) return null;

  if (showResult) {
    return (
      <div className="min-h-screen bg-[#f6f5f1] flex flex-col items-center justify-center p-6 text-[#333333]">
        <div className="w-full max-w-md bg-white p-10 rounded-lg shadow-sm border border-[#e6e4dc] text-center relative overflow-hidden">
          <img src="/12-13.PNG" className="absolute inset-0 w-full h-full object-contain opacity-10 pointer-events-none" alt="" />
          <div className="relative z-10">
            <h2 className="text-lg font-medium mb-4">{isReviewMode ? '復習完了' : '学習完了'}</h2>
            <p className="text-sm text-gray-500 mb-8">要復習の問題: {weakPointIds.length} 問</p>
            <div className="space-y-3">
              {weakPointIds.length > 0 && (
                <button onClick={startReview} className="w-full py-4 bg-[#7f7870] text-white rounded-md text-sm tracking-widest font-bold">間違えた問題だけ解き直す</button>
              )}
              <button onClick={resetNormal} className="w-full py-4 border border-[#e6e4dc] text-[#7f7870] rounded-md text-sm tracking-widest">全問題をシャッフルして再開</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="min-h-screen bg-[#f6f5f1] flex flex-col items-center p-6 font-sans text-[#333333]">
      
      {/* ステータスバー */}
      <div className="mt-8 mb-12 w-full max-w-md flex justify-between items-end border-b border-[#e6e4dc] pb-2">
        <div className="flex flex-col">
          <span className="text-[10px] tracking-[0.2em] text-gray-400 uppercase font-bold leading-none mb-1">{isReviewMode ? 'Review Mode' : 'Japan - Section 1'}</span>
          {isReviewMode && <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest">Weak Point Focus</span>}
        </div>
        <span className="text-sm font-light text-[#7f7870]">{currentIndex + 1} / {cards.length}</span>
      </div>

      {/* カード本体 */}
      <div className="relative w-full max-w-md h-[540px] cursor-pointer [perspective:1000px]" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
          
          {/* 表面（問題） */}
          <div className="absolute inset-0 w-full h-full bg-white rounded-lg border border-[#e6e4dc] flex flex-col items-center justify-center p-10 [backface-visibility:hidden] shadow-sm overflow-hidden">
            {/* カード内の背景画像 */}
            <img src="/12-13.PNG" alt="" className="absolute inset-0 w-full h-full object-contain opacity-10 pointer-events-none" />
            
            <div className="relative z-10 w-full overflow-y-auto custom-scrollbar px-2">
              <span className="block text-center text-[10px] tracking-widest text-[#bcbab2] font-bold uppercase mb-8">Question</span>
              <p className="text-base font-light leading-relaxed text-center whitespace-pre-wrap">{currentCard.question}</p>
            </div>
            <p className="absolute bottom-8 text-[10px] text-[#bcbab2] tracking-widest uppercase animate-pulse">Tap to reveal</p>
          </div>

          {/* 裏面（解答） */}
          <div className="absolute inset-0 w-full h-full bg-white rounded-lg border border-[#e6e4dc] flex flex-col items-center justify-center p-10 [backface-visibility:hidden] [transform:rotateY(180deg)] shadow-sm overflow-hidden">
             {/* カード内の背景画像 */}
             <img src="/12-13.PNG" alt="" className="absolute inset-0 w-full h-full object-contain opacity-15 pointer-events-none" />

            <div className="relative z-10 w-full overflow-y-auto max-h-[400px] pr-2 text-left custom-scrollbar">
              <span className="block text-center text-[10px] tracking-widest text-[#bcbab2] font-bold uppercase mb-8">Answer</span>
              <p className="text-sm font-normal leading-relaxed text-[#7f7870] whitespace-pre-wrap">{currentCard.answer}</p>
            </div>
          </div>

        </div>
      </div>

      {/* ボタン */}
      <div className={`mt-12 w-full max-w-md grid grid-cols-2 gap-6 transition-all duration-500 ${isFlipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <button onClick={(e) => { e.stopPropagation(); handleAnswer(false); }} className="py-4 border border-red-100 bg-white rounded-md text-xs tracking-widest text-red-400 font-bold shadow-sm">わからなかった</button>
        <button onClick={(e) => { e.stopPropagation(); handleAnswer(true); }} className="py-4 border border-green-100 bg-white rounded-md text-xs tracking-widest text-green-600 font-bold shadow-sm">正解</button>
      </div>
    </div>
  );
}