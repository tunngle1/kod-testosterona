# Ссылки на лендинг по источникам трафика

Базовый сайт: **https://kod-testosterona.vercel.app**

После регистрации пользователь попадает в бота с параметром `start=vebreg_{источник}`.

> В Salebot для каждого источника должна быть своя точка входа (например `vebreg_zdorovie_ru`).

| Источник | Ссылка на сайт | Параметр в Salebot |
|----------|----------------|--------------------|
| Здоровье ру | https://kod-testosterona.vercel.app/?from=zdorovie_ru | `vebreg_zdorovie_ru` |
| Альфа протокол YouTube | https://kod-testosterona.vercel.app/?from=alpha_protocol_youtube | `vebreg_alpha_protocol_youtube` |
| Живая сталь YouTube | https://kod-testosterona.vercel.app/?from=zhivaya_stal_youtube | `vebreg_zhivaya_stal_youtube` |
| Альфа инст | https://kod-testosterona.vercel.app/?from=alpha_inst | `vebreg_alpha_inst` |
| Евсеев 2 инст | https://kod-testosterona.vercel.app/?from=evseev2_inst | `vebreg_evseev2_inst` |
| ТГ основной | https://kod-testosterona.vercel.app/?from=tg_main | `vebreg_tg_main` |
| Сторис везде | https://kod-testosterona.vercel.app/?from=stories | `vebreg_stories` |
| ТГ закрытый | https://kod-testosterona.vercel.app/?from=tg_closed | `vebreg_tg_closed` |
| hvatov_taurus | https://kod-testosterona.vercel.app/?from=hvatov_taurus | `vebreg_hvatov_taurus` |
| moshkin_vladislav | https://kod-testosterona.vercel.app/?from=moshkin_vladislav | `vebreg_moshkin_vladislav` |
| Instagram | https://kod-testosterona.vercel.app/?from=instagram | `vebreg_instagram` |
| Telegram | https://kod-testosterona.vercel.app/?from=telegram | `vebreg_telegram` |

## UTM-формат (альтернатива)

Можно использовать стандартные UTM-метки — сайт читает `utm_source`:

```
https://kod-testosterona.vercel.app/?utm_source=alpha_inst&utm_medium=social
```

## Прямые ссылки в бота (минуя сайт)

```
https://telegram.me/Kod_testesterona_bot?start=vebreg_zdorovie_ru
https://telegram.me/Kod_testesterona_bot?start=vebreg_alpha_protocol_youtube
https://telegram.me/Kod_testesterona_bot?start=vebreg_zhivaya_stal_youtube
https://telegram.me/Kod_testesterona_bot?start=vebreg_alpha_inst
https://telegram.me/Kod_testesterona_bot?start=vebreg_evseev2_inst
https://telegram.me/Kod_testesterona_bot?start=vebreg_tg_main
https://telegram.me/Kod_testesterona_bot?start=vebreg_stories
https://telegram.me/Kod_testesterona_bot?start=vebreg_tg_closed
https://telegram.me/Kod_testesterona_bot?start=vebreg_hvatov_taurus
https://telegram.me/Kod_testesterona_bot?start=vebreg_moshkin_vladislav
```
