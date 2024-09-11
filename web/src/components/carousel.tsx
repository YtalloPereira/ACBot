'use client';

import 'swiper/css';
import 'swiper/css/pagination';

import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

export const Carousel = () => {
  return (
    <div className="from-primary to-primary/50 hidden bg-gradient-to-tr lg:flex lg:max-w-[calc(100%-550px)]">
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        autoplay={{ delay: 5000 }}
        slidesPerView={1}
        centeredSlides={true}
        centeredSlidesBounds={true}
        pagination={{ clickable: true }}
        navigation={true}
        loop={true}
        className="w-3/4"
      >
        <SwiperSlide>
          <div className="text-primary-foreground flex h-screen cursor-pointer select-none flex-col justify-center">
            <h1 className="text-center text-4xl font-bold">Conheça o Academic Soon</h1>
            <h3 className="text-center text-2xl">
              O Academic Soon é uma plataforma que serve para disponibilizar informações
              acadêmicas do Campus para que todos os estudantes possam ter fácil acesso.
            </h3>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="text-primary-foreground flex h-screen cursor-pointer select-none flex-col justify-center">
            <h1 className="text-center text-4xl font-bold">Conheça o ACBot</h1>
            <h3 className="text-center text-2xl">
              Se informe, abra processos, consulte status e muito mais com o ACBot, o
              nosso chatbot acadêmico.
            </h3>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="text-primary-foreground flex h-screen cursor-pointer select-none flex-col justify-center">
            <h1 className="text-center text-4xl font-bold">
              Cadastre-se e Descubra Mais
            </h1>
            <h3 className="text-center text-2xl">
              Conecte-se com a gente e venha conferir as demais funcionabilidades do nosso
              sistema.
            </h3>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};
