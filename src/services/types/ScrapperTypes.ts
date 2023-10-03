export type categType = 'Dança e Música' | 'Esportes' | 'Entretenimento' | 'Comédia e Drama' | 'Carros' | 'Moda' | 'Estilo de vida' | 'Animais de estimação e natureza' | 'Relacionamentos' | 'Sociedade' | 'Informativo' | 'Anime e quadrinhos' | 'Shows' | 'Cuidados e beleza' | 'Jogos' | 'Comédia' | 'Vida cotidiana' | 'Família' | 'Relacionamento' | 'Drama' | 'Roupa' | 'Sincronização labial' | 'Comida' | 'Esportes' | 'Animais' | 'Sociedade' | 'Carros' | 'Educação' | 'Fitness e Saúde' | 'Tecnologia' | 'Canto e dança';

export type analisysOptionsType = {
  video_num?: number;
  likes_min?: number;
  goto?: 'explore' | 'foryou';
  categories?: categType[];
};

export type analisysItemType = {
  id: string;
  desc: string;
  author: {
    uniqueId: string;
    nickname: string;
  };
  stats: {
    playCount: number;
    diggCount: number;
    shareCount: number;
    commentCount: number;
  };
  duetEnabled: boolean;
};


export type responseObjType = {
  itemList: analisysItemType[];
};

export type statItemsType = {
  likes: number;
};
