export interface Prefecture {
  name: string
  romaji: string
  furigana: string
  characters: string[]
}

export interface Region {
  id: string
  name: string
  nameEn: string
  nameKana: string // Added for Hiragana support
  prefectures: Prefecture[]
}

export const regions: Region[] = [
  {
    id: "hokkaido",
    name: "北海道地方",
    nameEn: "Hokkaido",
    nameKana: "ほっかいどうちほう",
    prefectures: [
      { name: "北海道", romaji: "Hokkaido", furigana: "ほっかいどう", characters: ["北", "海", "道"] },
    ],
  },
  {
    id: "tohoku",
    name: "東北地方",
    nameEn: "Tohoku",
    nameKana: "とうほくちほう",
    prefectures: [
      { name: "青森県", romaji: "Aomori", furigana: "あおもりけん", characters: ["青", "森", "県"] },
      { name: "岩手県", romaji: "Iwate", furigana: "いわてけん", characters: ["岩", "手", "県"] },
      { name: "宮城県", romaji: "Miyagi", furigana: "みやぎけん", characters: ["宮", "城", "県"] },
      { name: "秋田県", romaji: "Akita", furigana: "あきたけん", characters: ["秋", "田", "県"] },
      { name: "山形県", romaji: "Yamagata", furigana: "やまがたけん", characters: ["山", "形", "県"] },
      { name: "福島県", romaji: "Fukushima", furigana: "ふくしまけん", characters: ["福", "島", "県"] },
    ],
  },
  {
    id: "kanto",
    name: "関東地方",
    nameEn: "Kanto",
    nameKana: "かんとうちほう",
    prefectures: [
      { name: "茨城県", romaji: "Ibaraki", furigana: "いばらきけん", characters: ["茨", "城", "県"] },
      { name: "栃木県", romaji: "Tochigi", furigana: "とちぎけん", characters: ["栃", "木", "県"] },
      { name: "群馬県", romaji: "Gunma", furigana: "ぐんまけん", characters: ["群", "馬", "県"] },
      { name: "埼玉県", romaji: "Saitama", furigana: "さいたまけん", characters: ["埼", "玉", "県"] },
      { name: "千葉県", romaji: "Chiba", furigana: "ちばけん", characters: ["千", "葉", "県"] },
      { name: "東京都", romaji: "Tokyo", furigana: "とうきょうと", characters: ["東", "京", "調"] },
      { name: "神奈川県", romaji: "Kanagawa", furigana: "かながわけん", characters: ["神", "奈", "川", "県"] },
    ],
  },
  {
    id: "chubu",
    name: "中部地方",
    nameEn: "Chubu",
    nameKana: "ちゅうぶちほう",
    prefectures: [
      { name: "新潟県", romaji: "Niigata", furigana: "にいがたけん", characters: ["新", "潟", "県"] },
      { name: "富山県", romaji: "Toyama", furigana: "とやまけん", characters: ["富", "山", "県"] },
      { name: "石川県", romaji: "Ishikawa", furigana: "いしかわけん", characters: ["石", "川", "県"] },
      { name: "福井県", romaji: "Fukui", furigana: "ふくいけん", characters: ["福", "井", "県"] },
      { name: "山梨県", romaji: "Yamanashi", furigana: "やまなしけん", characters: ["山", "梨", "県"] },
      { name: "長野県", romaji: "Nagano", furigana: "ながのけん", characters: ["長", "野", "県"] },
      { name: "岐阜県", romaji: "Gifu", furigana: "ぎふけん", characters: ["岐", "阜", "県"] },
      { name: "静岡県", romaji: "Shizuoka", furigana: "しずおかけん", characters: ["静", "岡", "県"] },
      { name: "愛知県", romaji: "Aichi", furigana: "あいちけん", characters: ["愛", "知", "県"] },
    ],
  },
  {
    id: "kinki",
    name: "近畿地方",
    nameEn: "Kinki",
    nameKana: "きんきちほう",
    prefectures: [
      { name: "三重県", romaji: "Mie", furigana: "みえけん", characters: ["三", "重", "県"] },
      { name: "滋賀県", romaji: "Shiga", furigana: "しがけん", characters: ["滋", "賀", "県"] },
      { name: "京都府", romaji: "Kyoto", furigana: "きょうとふ", characters: ["京", "都", "府"] },
      { name: "大阪府", romaji: "Osaka", furigana: "おおさかふ", characters: ["大", "阪", "府"] },
      { name: "兵庫県", romaji: "Hyogo", furigana: "ひょうごけん", characters: ["兵", "庫", "県"] },
      { name: "奈良県", romaji: "Nara", furigana: "ならけん", characters: ["奈", "良", "県"] },
      { name: "和歌山県", romaji: "Wakayama", furigana: "わかやまけん", characters: ["和", "歌", "山", "県"] },
    ],
  },
  {
    id: "chugoku",
    name: "中国地方",
    nameEn: "Chugoku",
    nameKana: "ちゅうごくちほう",
    prefectures: [
      { name: "鳥取県", romaji: "Tottori", furigana: "とっとりけん", characters: ["鳥", "取", "県"] },
      { name: "島根県", romaji: "Shimane", furigana: "しまねけん", characters: ["島", "根", "県"] },
      { name: "岡山県", romaji: "Okayama", furigana: "おかやまけん", characters: ["岡", "山", "県"] },
      { name: "広島県", romaji: "Hiroshima", furigana: "ひろしまけん", characters: ["広", "島", "県"] },
      { name: "山口県", romaji: "Yamaguchi", furigana: "やまぐちけん", characters: ["山", "口", "県"] },
    ],
  },
  {
    id: "shikoku",
    name: "四国地方",
    nameEn: "Shikoku",
    nameKana: "しこくちほう",
    prefectures: [
      { name: "徳島県", romaji: "Tokushima", furigana: "とくしまけん", characters: ["徳", "島", "県"] },
      { name: "香川県", romaji: "Kagawa", furigana: "かがわけん", characters: ["香", "川", "県"] },
      { name: "愛媛県", romaji: "Ehime", furigana: "えひめけん", characters: ["愛", "媛", "県"] },
      { name: "高知県", romaji: "Kochi", furigana: "こうちけん", characters: ["高", "知", "県"] },
    ],
  },
  {
    id: "kyushu",
    name: "九州・沖縄地方",
    nameEn: "Kyushu & Okinawa",
    nameKana: "きゅうしゅう・おきなわちほう",
    prefectures: [
      { name: "福岡県", romaji: "Fukuoka", furigana: "ふくおかけん", characters: ["福", "岡", "県"] },
      { name: "佐賀県", romaji: "Saga", furigana: "さがけん", characters: ["佐", "賀", "県"] },
      { name: "長崎県", romaji: "Nagasaki", furigana: "ながさきけん", characters: ["長", "崎", "県"] },
      { name: "熊本県", romaji: "Kumamoto", furigana: "くまもとけん", characters: ["熊", "本", "県"] },
      { name: "大分県", romaji: "Oita", furigana: "おおいたけん", characters: ["大", "分", "県"] },
      { name: "宮崎県", romaji: "Miyazaki", furigana: "みやざきけん", characters: ["宮", "崎", "県"] },
      { name: "鹿児島県", romaji: "Kagoshima", furigana: "かごしまけん", characters: ["鹿", "児", "島", "県"] },
      { name: "沖縄県", romaji: "Okinawa", furigana: "おきなわけん", characters: ["沖", "縄", "県"] },
    ],
  },
]
