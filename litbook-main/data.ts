import { Book, User, Activity, Publication, CommunityPost, FollowUser } from './types';

// FIX: Added 'id' to satisfy the User interface.
export const MOCK_USER: User = {
  id: 1,
  name: 'Maria',
  avatarUrl: 'https://picsum.photos/id/237/100/100',
  bio: 'Amante da leitura e da reflexão. Compartilhando pensamentos e versículos inspiradores.'
};

const sunTzuBook: Book = {
  id: 1,
  title: 'A Arte da Guerra',
  author: 'Sun Tzu',
  coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgCC_aRBonq08YAumPHQ91Zn9P-SAzrZW5SCExZzyuyDcnT1zfZLnBPJ6qYPOOpuPsKcLU2y3oqf1X1EI3KHfwE2-7qnTqYdGd78-S9wpNO8M1vuk-Fx90K3PVKN362OOxPYOAC_myQV4bCzPjAFvHaQiroadijRDCnYd5BR-ReBGhnEvMa1xkmToT0OZNBFCPgJE1c6goDBXWkeqQbgF61TpX8ci0m6s15qvwoUSNgRTDkoxusoU3sBPdOTAiaHwqG0yMdH7sV1g',
  description: '"A Arte da Guerra" é um tratado militar clássico escrito por Sun Tzu, um general, estrategista e filósofo chinês. A obra é composta por 13 capítulos, cada um dedicado a um aspecto da arte da guerra, e é amplamente considerada uma das obras mais importantes sobre estratégia militar já escritas.',
  preface: 'A guerra é de vital importância para o Estado; é o domínio da vida ou da morte, o caminho para a sobrevivência ou a perda do Império: é preciso manejá-la bem. Quem não reflete seriamente sobre tudo o que lhe concerne, mostra uma lastimável indiferença a respeito da conservação ou da perda do que lhe é mais caro, e isso não deve ocorrer entre nós...',
  chapters: [
    { id: 1, title: 'Avaliações', subtitle: 'Sobre a avaliação dos planos.', content: ['Sun Tzu disse: A arte da guerra é de vital importância para o Estado.', 'É uma questão de vida ou de morte, uma estrada para a segurança ou para a ruína. Portanto, é um assunto de investigação que não pode, em hipótese alguma, ser negligenciado.', 'A arte da guerra, então, é governada por cinco fatores constantes, a serem levados em conta em nossas deliberações, ao buscar determinar as condições que prevalecem no campo.'] },
    { id: 2, title: 'Guerreando', subtitle: 'Sobre o início das ações militares.', content: ['No geral, a arte da guerra é de importância vital para o Estado.', 'É uma questão de vida ou morte, um caminho para a segurança ou para a ruína.'] },
    { id: 3, title: 'Estratégia Ofensiva', subtitle: 'Sobre o ataque estratégico.', content: ['A melhor vitória é vencer sem lutar.'] },
    { id: 4, title: 'Disposições', subtitle: 'Sobre o posicionamento das tropas.', content: [] },
    { id: 5, title: 'Energia', subtitle: 'Sobre o uso da força e do momento.', content: [] },
    { id: 6, title: 'Pontos Fortes e Fracos', subtitle: 'Sobre explorar as fraquezas do inimigo.', content: [] },
    { id: 7, title: 'Manobras', subtitle: 'Sobre a movimentação do exército.', content: [] },
  ]
};

export const MOCK_BOOKS: Book[] = [
  {
    id: 2,
    title: 'O Hobbit',
    author: 'J.R.R. Tolkien',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlvlFoz2vTjdbhxFsQSGOJ6b33gGdcxviRyEKlF6PPwsrsPrA4nRHWM2kpiGdLa6SweVtViXI8tsRHKWqFrD1b8jdmjXEmBDiAFlD462wCjsVUrlenRpcjLQkFt4uSeQcviNpjzZ7bnqT1tHXqtDJL2299lVD1xNSSuZ6eKIv1icYfvmORf9NNd0I021nqWoC2ZAQDWBGXwS5VpQCr8ZAP4M-ffw52QLrSYvtWqVm01yBGZ0hG00YCI8MF-04g2zNgro1WeAgs4GA',
    description: 'A fantastic journey of Bilbo Baggins.',
    preface: 'In a hole in the ground there lived a hobbit.',
    chapters: [{ id: 1, title: 'An Unexpected Party', subtitle: '', content: ['...'] }]
  },
  {
    id: 3,
    title: 'Duna',
    author: 'Frank Herbert',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD1kwjGN_AsPHrcIGpxSIWJBx83oFr87HQFu87nEov1bC2n3-8Us7RhgJnVkiQ0wBo2MTmGLYjU8ML0aOV4B00t-QJXMq3fN4ZPqT6ibWGiCgOjw-mFohJujB-pE6MyN-tcSA3M3cR8LXt26qSVlfkBin9ivF5C49Z19CElK5YLxi3EZDD8jxhUHOKZbWAPy0WSLgb5PYBCfptZBfq2tmZLkwNAWvL9YKil09CFCFXg0MSsKVEVZ_4G6oNIEI30ySGu4ILvVvJ7qbU',
    description: 'A story of political intrigue and adventure on the desert planet Arrakis.',
    preface: 'A beginning is the time for taking the most delicate care that the balances are correct.',
    chapters: [{ id: 1, title: 'Dune', subtitle: '', content: ['...'] }]
  },
  {
    id: 4,
    title: '1984',
    author: 'George Orwell',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNAxf5Ay8MQaqec7JYFP9B-Cn1WUSygY1AGhZ61rCl_giR8Gl0sZYiex_RrZs3GkT4tlHQlT9cSMLvKo6WMNm5CwzQs_rR-ttI6lgFOWnXNdh5ckMDN6MoPUhZzDOiIG4UeOgZ7YyVv-moHgbr2eUxHo1ABjRC8uslIiXPLsCoIaK2K2HibjbbtyZysLR3zmWCrapOwMMR_HxrB1-cMdRasbml0RmIsnZkriC8lfPQX40DO4riCLBDqSRyGHXz0rkYbuNVwksFOAo',
    description: 'A dystopian novel about omnipresent government surveillance and public manipulation.',
    preface: 'It was a bright cold day in April, and the clocks were striking thirteen.',
    chapters: [{ id: 1, title: 'Part One, Chapter 1', subtitle: '', content: ['...'] }]
  },
  sunTzuBook,
  {
    id: 5,
    title: 'O Príncipe',
    author: 'Nicolau Maquiavel',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3zKMxkRN2Fq7lieqkSi5oxjuufs97W9IJpxL0yQqFxM7gUur_D_Vdy_5VzNBX9CFVexSiJ0P7Lmr-MEHk3MBr9YoxkTVQi6TZsfgwD0rxtKgyo4LrkVc3FreNEIFWFsLftW-eKFchbNfVrng0sDeKg8ZM7L_Oiagcjc9df3CyjK6E91TYe0pePIGyGlvuPERkxF1ADqkMDzjkxrRWGcPpUvLiBEjkufbhiDw9bTqC5g-rQSZMrMzyeTofpXEdCEwoapTBGwmd2tA',
    description: 'A 16th-century political treatise.',
    preface: '...',
    chapters: [{ id: 1, title: 'Chapter 1', subtitle: '', content: ['...'] }]
  },
  {
    id: 6,
    title: 'Meditações',
    author: 'Marco Aurélio',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_OAmBRVlCsiunGGJOv-1Z2bXGceqCJJUSJUi_tYczRoAc1LAppQLm5qpbsTZ5Bmou-pFQrWphOkYQheMIKbTsZ9GYJKQlVskXhd1du4nwzhFC8Tn8FlPSA5LcJrEoOp1eeqaZvUBCKD8C7ftgYQxc8C7WWX1SCR0IE0xWeiDimk9JdM8ozCwxCOvRK9G6nh6BTdwROWjsl24k1xFhC5nNqkjCYbs-q2pKCmdKiBxYjrrAJ6UWi2pM04I-AoJ1R0p0Pr-oYjYP-RE',
    description: 'A series of personal writings by the Roman Emperor Marcus Aurelius.',
    preface: '...',
    chapters: [{ id: 1, title: 'Book 1', subtitle: '', content: ['...'] }]
  },
  {
    id: 7,
    title: 'Sapiens: Uma Breve História da Humanidade',
    author: 'Yuval Noah Harari',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZ8B2oB5FAvJby71J4vpoO-TFhrj01fXmRr8M6_XMZtXTlLBzvgXb5KCXrh5yH-TeHEnR2vXuSgFYy4IDE850pC3tHcklBIrFMCi9e5nhyLJpH4lrqEVX87vUcR2V3KVwVPBSDdmM2Q2N6FQeMHOQSTUKTZ8RelvdBD5qTRi5oe_hEq2srDaGk5r4Uj9qtpUYxVvpcVsFILsRPhCbkgR22PJwigHxpWNAt4lmu0_gWntjGPw4fkZRK1D7PcyqFCsLF9YyjcsgNVwc',
    description: 'A book by Yuval Noah Harari, first published in Hebrew in Israel in 2011.',
    preface: '...',
    chapters: [{ id: 1, title: 'The Cognitive Revolution', subtitle: '', content: ['...'] }]
  },
   {
    id: 8,
    title: 'Grande Sertão: Veredas',
    author: 'João Guimarães Rosa',
    coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvbJ0vdGdpxkngv-HDez59UCkzoCgq0Xv2RrPvx4kHkuQuTJWTw1LBgo4H33J5sK07_OCBysUxixMOvpK8JEHI4nkBlqMihA9KvQqgSjSdgh5CaBUofl6U2gNModKs152Y5o1cPmY_HhZQm3j0xU_zld_6IZnJ-207WShm684npXvqgCgdE6Y5LkZZq6q7HBPJyx9kPUmQlQyHT8qxdJYoFerkHEk52QGvHBz0fxiY-T4AS0o1C9u324HC6mkzw0FzHhWbdwfsLt8',
    description: 'Classic of Brazilian literature.',
    preface: '...',
    chapters: [{ id: 1, title: 'Chapter 1', subtitle: '', content: ['...'] }]
  },
];

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 1,
    // FIX: Added 'id' to satisfy the User interface.
    user: { id: 2, name: 'Ana Souza', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlNRwlJYHEERasZuJrii1rbIUCl93gU1aQAQTctlSCIChuUhDXyPo4PYboT3D55uajewOaEXxC8q74NfUevsznm44STg2k9aNkyX4qzJhGqoO_fMlXFHZlRe2TEQynS8VaZofZXijPotnagg2TzJ6GBsHziv_RMs4woLnJG10CWDu46LUDNrmQAyHckoPFY6puC505lw_cIFQKbYUELxE11ykaSzkXQJTJW4SXrdslw2yLsnQaE8aQWrWHvcnrpCM4YR2GAd4FW78' },
    action: 'terminou de ler',
    book: MOCK_BOOKS.find(b => b.id === 4),
    comment: '"Uma leitura que te prende do início ao fim. Assustadoramente atual. Recomendo demais!"',
    likes: 12,
    comments: 5,
  },
  {
    id: 2,
    // FIX: Added 'id' to satisfy the User interface.
    user: { id: 3, name: 'João Silva', avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCw4zO5OUhdxV5V19UzUFtH5ywQ_A6jaoguyw21Ntw9LOTmVOmu_An0InE7xRomL1GIepQR7vqVqCJPu7MVPUF5dTxPEadGAjvfW2ah59AJln3eFE7SuqVfjPguXYY39WTBcapmcSufjbo5dEkHXGcJRu_pr9LGrcflQ07Ob9Yp-Imnf4LRtFGPeYnYRWboJFeoF1frj5ahV06rUin8uFR18H43R3RwmVmAvtOdAh49HuSMT8rZ6cDhBuW-419s4szM4niWf1Ood5k' },
    action: 'adicionou à sua lista',
    book: MOCK_BOOKS.find(b => b.id === 8),
    comment: '"Sempre quis ler este clássico da literatura brasileira. Finalmente vou começar essa jornada!"',
    likes: 8,
    comments: 2,
  }
];

export const MOCK_COMMUNITY_POSTS: CommunityPost[] = [
    {
        id: 1,
        // FIX: Added 'id' to satisfy the User interface.
        user: {
            id: 4,
            name: 'João Pereira',
            avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMpY0Ac-vleuP29oVGECETfQzSFwTCfRtDg_kA8TC4TICpBcSKwRmWw6NjLCq6mQaJJ2wlNTWZr10cVVamtps9fDbq2tH8P6DVrtte4PMC97yIgsAeRv4o-Aw_rZFyfP7s79z61fpsFZgB--7pzXhPcR8a2yq3fZG3-zLYS6Ut6iJTcVYiOHdZ8mzEcW5iinKUTtj7BXYDnYaeprXcz_kFG7oE4bKF7amxAROjTXiDad_yok5QuOT42DCjBT-GfXYkWImyFOtYEcA',
        },
        timestamp: 'há 2 horas',
        quote: 'No princípio, criou Deus os céus e a terra.',
        comment: 'Este versículo sempre me lembra da importância de começar bem o dia.',
        bookVerse: 'Gênesis 1:1',
        likes: 12,
        comments: 3,
        isLiked: false,
        isFollowing: false,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDq5GmZvCZ-z7ErZgguKp4ekH3W5eZMquL-SYfJXaUlK7D7qijK_vZLJ46bcqfOkSlpoWtr_5oDEGyaQAkmvYH59bcIK3V6xNX9s0j09x6_Cu6QDCTcf3toXVT5Ad2XIoEpGXQF9-yZCKS8LMSZjKaNoJgAl7nVYYebpHVlPFk753lBvzxenbS96Lvjk-DtaEiJIlMlT2k02SgLIVWTIY7A9MDD1v2QlvVxTw31AZCPwg_qGMkPlRQ8Rp28ESgWD7sd6OuXa99eRmg',
    },
    {
        id: 2,
        // FIX: Added 'id' to satisfy the User interface.
        user: {
            id: 5,
            name: 'Ana Silva',
            avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8cWax1WVU7lWgY4gXwwdwBTAxPV09t4Y56OeIbrhFX4O0dfwwHXRxBiCJYHluayOPC3grgPijKTC54shgFBFyyh_HlXWc1gROedQPr0PX6Dp06VeZWtANqvrshLIQhSxq7e9VRa91hPoMHzKi2Ryz2Pe6nFGU_wqxX2KVPZssp5Fnk0et_P8ocwh-4T4RiDpQYXc7ENs_G4G9AlteWoywtaCDKcbY1z_GVWh9WydBGBkWIEYAtWBfEzh_JUNVI90jIIx9NX4rpdA',
        },
        timestamp: 'há 5 horas',
        quote: 'O Senhor é o meu pastor; de nada terei falta.',
        comment: 'Um lembrete para confiar, não importa a situação.',
        bookVerse: 'Salmos 23:1',
        likes: 45,
        comments: 11,
        isLiked: true,
        isFollowing: true,
    }
];


const MOCK_PUBLICATIONS: Publication[] = [
    {
        id: 1,
        verse: 'Gênesis 1:1-2',
        title: 'Anotação sobre o começo',
        quote: '"No princípio, criou Deus os céus e a terra. E a terra era sem forma e vazia; e havia trevas sobre a face do abismo..."',
        content: 'Esta passagem sempre me lembra da importância dos novos começos e do poder da criação a partir do nada. É uma fonte de inspiração diária.',
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD24fCe2HjJZHEYMsgVZ6fd2MumNP6vKDpai0Es1pC35FzLF1bAsWbsba5sjt5CblVf0u04aYKcDUyzfF7ny3H8rTl_l8y02hcgFfhQv4gQQPAFCpEWriBYhoC1tr9Fle6cyFgUIc0h1wy1Y1CrusF_d9fi0iU3vGfsevWqKC3YP2fURcm8CdnLLlvBjQhG0ADu2oW-jpF3eXPFqiuemhLNGVC0mx_6oS4ZxkRWhRBx7nQeQ9Tl1jGWXT7lMmy7fWodJ435BD0MHnU',
        likes: 15,
        comments: 4,
        shares: 2
    },
    {
        id: 2,
        verse: 'Salmos 23:1',
        title: 'Confiança e Provisão',
        quote: '"O Senhor é o meu pastor; nada me faltará."',
        content: 'Um lembrete diário de que não estou sozinho em minha jornada. A confiança em algo maior traz paz ao coração.',
        likes: 28,
        comments: 9,
        shares: 7
    }
];

// FIX: Added 'id' to satisfy the User interface.
export const MOCK_USER_PROFILE: User = {
    id: 6,
    name: 'João da Silva',
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrcmaUa2FaWDspftnrxZfpUQLJBpLocbupB7KSG13qfFkpN1Te8sdn7jcxiuehpMmVJd9S6xDRDLGRvTYWk95jXcjgft3VeG42RCeotl9wFhkv8T5LsE8HxW33TBcorBScwiScJxE048u6Lfid2Ls-W6ENoVvUJBXHq8tWXPp70Gbikbb_hlwxWiiXMWn9E76TDXIMgdD-bTscrZEV-Eyta_KMpfAEzHcTKQUERDb_6h_uxDho93DQNN5wMeQvLJPO4C-pURXsHcQ',
    bio: 'Amante da leitura e da reflexão. Compartilhando pensamentos e versículos inspiradores.',
    publications: MOCK_PUBLICATIONS,
    followers: 1250,
    following: 134,
};

export const MOCK_FOLLOWING_LIST: FollowUser[] = [
    {
        // FIX: Added 'id' to satisfy the FollowUser interface.
        id: 7,
        name: 'Ana Clara',
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQebCFHm1nlHyLQSkPExLH_DKr8orf5L6IOt1HcHLXR_GbCU15FwXi1NpECmyJ9_U8_kx0QaA1d_e-3eSxyrJASmVKHj06A9YXqwqjjJnJP5Y89SBSkb7RiwIQVyzrfIRs8H6-HdNvKFqwVef-Ox_KLkcLjXgi0OOpfbPaBVR6hd3OHYbOCARGQ5GkQ9Hv-wg9fQV-nxi0R2XatWlgTXY7iXeReS34Wjk-EzTGYq8nvaYcJ70uzx6b-1Vu-VdREFEAbTfPtycROt0',
        isFollowing: true,
        bio: '',
    },
    {
        // FIX: Added 'id' to satisfy the FollowUser interface.
        id: 8,
        name: 'Bruno Martins',
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAkDf02CyiId2kH_Cui2TfeuC4u4raEV2gSxoyw7fdE7w4xjE-rr8rScoMJsyvN9OyjEeMCCw4wq0aqMoU7G2OOm5dFgW8gsfAfPykgukDlo-vRolyzFjjlVbvTq6HURyq-wjgzQnRKmlYJE-_aSKTe27Ysegbmty_CF9DIcMS6HfvBZxqorT_rTuan8stSP_PH4LN6R8amUf6GlLFFUeb3hDyQj1Tm2V-kMmaXrvAymsJ_bc7f54CVGrDkTJPQijWA15mesIz3mgc',
        isFollowing: false,
        bio: '',
    },
    {
        // FIX: Added 'id' to satisfy the FollowUser interface.
        id: 9,
        name: 'Carla Souza',
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcxf-m82FTjDHmX8RwwgfnEQDuRtGJWj_xsItYe4WwwOvMees9mH770TZruzk-Pg5kFYnFfRo67ELKUAma3H0oGeGB9NcxcsVON9Qpu2PnnEQLS_JcLjSGeEzS9aNngji4b0763CGcA8JLLkYGr_1bQXCd9ETx0_Tu8aT5wxawOywAalMMb0SCf4CeY_EuxQddIMhNtCwOSFKlwCn_pgaCBJWYgi0kGvbsYhSATdbwG8nIYvpUt4mn-Xj3WL5rk-o3iUPSuhlFJeg',
        isFollowing: true,
        bio: '',
    },
    {
        // FIX: Added 'id' to satisfy the FollowUser interface.
        id: 10,
        name: 'Daniel Ferreira',
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNNR1g6l6Sz0UiCwmavRL6jTWpbAudjSSxvCpatulF3KzyIPwv9zH16bgzP-uqqr8ZccmNYIfyIsdJ5OqFtsXLvT-Z_I7zYZfObe4-ZyPekGSlpEgf-HIypKgvVA40WSWA4ChJr4MfaruK4KA4zWBMmQGjlc2iPKCB-Hi_ygWvenzEVgelSXOKEzsS0WxJ7JqJVGXwoXhr6_BBi-9cCrBQ9qJmjbhbSHC0BCt-n3RlyCuLIDnAXcRD_ttSfZ9URDoLYQWh1ENYkjo',
        isFollowing: true,
        bio: '',
    },
    {
        // FIX: Added 'id' to satisfy the FollowUser interface.
        id: 11,
        name: 'Eduardo Lima',
        avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFI6eFEzg55dQ6l6H2zfkOX16dkMeQvc0Xe5AO4JDH4XvnmUYBPdh-yexrQhU5xNz9K3OLsB7lfXBwh5qcJmIyrfJpqgojN_qef-zGFKG9xrW3so7YzXzjEanS6NTCdZtVRfssmvKGHX9pDxQ8krPYNGcPH2WdF4KJivPWKMrx7oORB3OY2dxai5t2C_exqHU_Lfzqi7aFBAMEKJ-rnNULdNYAeH0vlVRF-bUoLts95Y8V5Rcov_aR0z1Cx_RadSkLgMnuBiOGawg',
        isFollowing: false,
        bio: '',
    }
];