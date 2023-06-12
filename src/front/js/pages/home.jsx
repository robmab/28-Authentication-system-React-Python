import React, { useEffect, useState, useContext } from "react";

import { Context } from "../store/appContext";

import "../../styles/home.css";

import { Card } from "../component/card.jsx";

export const Home = () => {
  const { store } = useContext(Context);


  return (
    <div className="home-wrapper">
      <h1>Characters</h1>
      <div className="card-wrapper">
        {store.people !== undefined
          ? store.people.map((x, y) => (
              <Card
                type="characters"
                key={x.uid}
                id={x.uid}
                keyStore={y}
                name={x.name}
                url={
                  x.name === "Luke Skywalker"
                    ? "https://kanto.legiaodosherois.com.br/w760-h398-cfill/wp-content/uploads/2022/12/legiao_CvIZbdSUJtTG.jpg.webp"
                    : x.name === "C-3PO"
                    ? "https://media.vandalsports.com/i/1706x960/6-2022/202267175430_1.jpg.webp"
                    : x.name === "R2-D2"
                    ? "https://s1.eestatic.com/2017/06/29/series/cine/star_wars-george_lucas-peliculas_227488145_37888495_1706x960.jpg"
                    : x.name === "Darth Vader"
                    ? "https://estaticos-cdn.prensaiberica.es/clip/abc3c1ee-ff88-4a49-88d2-14d6ae5ee52e_16-9-aspect-ratio_default_0.jpg"
                    : x.name === "Leia Organa"
                    ? "https://www.lavanguardia.com/files/image_948_465/uploads/2017/12/08/5fa3d8e24f841.jpeg"
                    : x.name === "Owen Lars"
                    ? "https://www.tiempoderecreo.com/wp-content/uploads/2023/02/%C2%BFQuien-es-el-hermano-de-Obi-Wan-Kenobi-Conoce-a-Owen.jpg"
                    : x.name === "Beru Whitesun lars"
                    ? "https://lumiere-a.akamaihd.net/v1/images/beru-lars-main_fa680a4c.png?region=342%2C0%2C938%2C527"
                    : x.name === "R5-D4"
                    ? "https://www.looper.com/img/gallery/r5-d4-the-complete-history-of-din-djarins-ally-in-the-mandalorian-explained/intro-1678514086.webp"
                    : x.name === "Biggs Darklighter"
                    ? "https://lumiere-a.akamaihd.net/v1/images/image_606ff7f7.jpeg?region=0%2C0%2C1560%2C878"
                    : x.name === "Obi-Wan Kenobi"
                    ? "https://phantom-marca.unidadeditorial.es/a12ae8bfd4cbe2bbec80cc9c70ea6301/resize/1320/f/jpg/assets/multimedia/imagenes/2022/05/26/16535796722201.jpg"
                    : "https://camo.githubusercontent.com/908353dc3ced1a991b7ab6c188819379f2aa8024bd960117250bb6f0146e76e9/68747470733a2f2f7669612e706c616365686f6c6465722e636f6d2f343030783230302e706e67"
                }
              />
            ))
          : null}
      </div>
      <h1>Vehicles</h1>
      <div className="card-wrapper">
        {store.vehicles !== undefined
          ? store.vehicles.map((x, y) => (
              <Card
                type="vehicles"
                key={x.uid}
                id={x.uid}
                keyStore={y}
                name={x.name}
                url={
                  x.name === "Sand Crawler"
                    ? "https://lumiere-a.akamaihd.net/v1/images/sandcrawler-main_eb1b036b.jpeg?region=251%2C20%2C865%2C487"
                    : x.name === "X-34 landspeeder"
                    ? "https://lumiere-a.akamaihd.net/v1/images/E4D_IA_1136_6b8704fa.jpeg?region=237%2C0%2C1456%2C819"
                    : x.name === "T-16 skyhopper"
                    ? "https://cdnb.artstation.com/p/assets/images/images/046/978/031/large/kenji-marcio-t16-starwarsscene1-sl.jpg?1646434609"
                    : x.name === "TIE/LN starfighter"
                    ? "https://img5.goodfon.com/wallpaper/nbig/d/5e/kuba-grzybowski-by-kuba-grzybowski-may-the-4th-be-with-you-s.jpg"
                    : x.name === "Snowspeeder"
                    ? "https://lumiere-a.akamaihd.net/v1/images/snowspeeder_ef2f9334.jpeg?region=0%2C211%2C2048%2C1154"
                    : x.name === "AT-AT"
                    ? "https://www.univision.com/proxy/api/cached/picture?href=https%3A%2F%2Fuvn-brightspot.s3.amazonaws.com%2Fassets%2Fvixes%2Fs%2Fstarwars-at-at-3.jpeg&width=0&height=0&ratio_width=1240&ratio_height=698&format=webp"
                    : x.name === "TIE bomber"
                    ? "https://lumiere-a.akamaihd.net/v1/images/tie-bomber-1-retina_d3ea46d8.jpeg?region=0%2C0%2C1200%2C675"
                    : x.name === "AT-ST"
                    ? "https://i.pinimg.com/originals/fc/ab/a7/fcaba7f9673ab97ff222ef30facda93f.jpg"
                    : x.name === "Storm IV Twin-Pod cloud car"
                    ? "https://i.pinimg.com/originals/79/f6/bb/79f6bbeeb52dc2470fd430575cc2d811.png"
                    : x.name === "Sail barge"
                    ? "https://www.brickfanatics.com/wp-content/uploads/2023/03/Star-Wars-Return-of-the-Jedi-Jabbas-Sail-Barge-800x445.jpg.webp"
                    : "https://camo.githubusercontent.com/908353dc3ced1a991b7ab6c188819379f2aa8024bd960117250bb6f0146e76e9/68747470733a2f2f7669612e706c616365686f6c6465722e636f6d2f343030783230302e706e67"
                }
              />
            ))
          : null}
      </div>
      <h1>Planets</h1>
      <div className="card-wrapper">
        {store.planets !== undefined
          ? store.planets.map((x, y) => (
              <Card
                type="planets"
                key={x.uid}
                id={x.uid}
                keyStore={y}
                name={x.name}
                url={
                  x.name === "Tatooine"
                    ? "https://hips.hearstapps.com/es.h-cdn.co/fotoes/images/noticias-cine/tatooine-escenario-de-star-wars-acechado-por-isis/45905396-1-esl-ES/Tatooine-escenario-de-Star-Wars-acechado-por-ISIS.png?crop=1xw:0.8717948717948718xh;center,top&resize=980:*"
                    : x.name === "Alderaan"
                    ? "https://lumiere-a.akamaihd.net/v1/images/alderaan-main_f5b676cf.jpeg?region=0%2C0%2C1280%2C720"
                    : x.name === "Yavin IV"
                    ? "https://frikipolis.com/wp-content/uploads/2022/03/1OcJFCKRdBvi0lDLpA59n2bIgcsJIv_ZBnie20vquOE.jpg"
                    : x.name === "Hoth"
                    ? "https://frikipolis.com/wp-content/uploads/2021/07/unnamed-file-54.jpg"
                    : x.name === "Dagobah"
                    ? "https://lumiere-a.akamaihd.net/v1/images/Dagobah_890df592.jpeg?region=0%2C80%2C1260%2C711"
                    : x.name === "Bespin"
                    ? "https://frikipolis.com/wp-content/uploads/2022/05/SWBF_dlc_screenhi_930x524_en_US_bespin_cloud5_v1.jpg"
                    : x.name === "Endor"
                    ? "https://frikipolis.com/wp-content/uploads/2022/08/ddfba4u-55eccc09-f132-4fca-af19-a80ea4056881.png"
                    : x.name === "Naboo"
                    ? "https://pbs.twimg.com/media/FEkJLtSXoActizy?format=jpg&name=large"
                    : x.name === "Coruscant"
                    ? "https://images.theconversation.com/files/516943/original/file-20230322-26-d15ks9.jpg?ixlib=rb-1.1.0&rect=0%2C12%2C3464%2C1732&q=45&auto=format&w=1356&h=668&fit=crop"
                    : x.name === "Kamino"
                    ? "https://preview.redd.it/snfw92qa8sd61.png?width=960&crop=smart&auto=webp&v=enabled&s=918e5460385c5ba9593f9c919ffc6b9714ab4f39"
                    : "https://camo.githubusercontent.com/908353dc3ced1a991b7ab6c188819379f2aa8024bd960117250bb6f0146e76e9/68747470733a2f2f7669612e706c616365686f6c6465722e636f6d2f343030783230302e706e67"
                }
              />
            ))
          : null}
      </div>
    </div>
  );
};
