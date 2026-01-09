export const getAgencyConfigs = (env) => ({
  "ca_chambly_richelieu_carignan_citcrc": { // exo CRC // min interval of 05 seconds between each call to service
    serviceAlertsUrl: 'https://exo.chrono-saeiv.com/api/opendata/v1/CITCRC/alert?token=',
    serviceAlertsUrlWithSecret: `https://exo.chrono-saeiv.com/api/opendata/v1/CITCRC/alert?token=${env.MT_GTFS_RT_ca_chambly_richelieu_carignan_citcrc}`,
    vehiclePositionsUrl: 'https://exo.chrono-saeiv.com/api/opendata/v1/CITCRC/vehicleposition?token=',
    vehiclePositionsUrlWithSecret: `https://exo.chrono-saeiv.com/api/opendata/v1/CITCRC/vehicleposition?token=${env.MT_GTFS_RT_ca_chambly_richelieu_carignan_citcrc}`
  },
  "ca_l_assomption_mrclasso": { // exo LASSO // min interval of 05 seconds between each call to service
    serviceAlertsUrl: 'https://exo.chrono-saeiv.com/api/opendata/v1/MRCLASSO/alert?token=',
    serviceAlertsUrlWithSecret: `https://exo.chrono-saeiv.com/api/opendata/v1/MRCLASSO/alert?token=${env.MT_GTFS_RT_ca_l_assomption_mrclasso}`,
    vehiclePositionsUrl: 'https://exo.chrono-saeiv.com/api/opendata/v1/MRCLASSO/vehicleposition?token=',
    vehiclePositionsUrlWithSecret: `https://exo.chrono-saeiv.com/api/opendata/v1/MRCLASSO/vehicleposition?token=${env.MT_GTFS_RT_ca_l_assomption_mrclasso}`
  },
  "ca_la_presqu_ile_citpi": { // exo PI // min interval of 05 seconds between each call to service
    serviceAlertsUrl: 'https://exo.chrono-saeiv.com/api/opendata/v1/CITPI/alert?token=',
    serviceAlertsUrlWithSecret: `https://exo.chrono-saeiv.com/api/opendata/v1/CITPI/alert?token=${env.MT_GTFS_RT_ca_la_presqu_ile_citpi}`,
    vehiclePositionsUrl: 'https://exo.chrono-saeiv.com/api/opendata/v1/CITPI/vehicleposition?token=',
    vehiclePositionsUrlWithSecret: `https://exo.chrono-saeiv.com/api/opendata/v1/CITPI/vehicleposition?token=${env.MT_GTFS_RT_ca_la_presqu_ile_citpi}`
  },
  "ca_laurentides_citla": { // exo LA // min interval of 05 seconds between each call to service
    serviceAlertsUrl: 'https://exo.chrono-saeiv.com/api/opendata/v1/CITLA/alert?token=',
    serviceAlertsUrlWithSecret: `https://exo.chrono-saeiv.com/api/opendata/v1/CITLA/alert?token=${env.MT_GTFS_RT_ca_laurentides_citla}`,
    vehiclePositionsUrl: 'https://exo.chrono-saeiv.com/api/opendata/v1/CITLA/vehicleposition?token=',
    vehiclePositionsUrlWithSecret: `https://exo.chrono-saeiv.com/api/opendata/v1/CITLA/vehicleposition?token=${env.MT_GTFS_RT_ca_laurentides_citla}`
  },
   "ca_le_richelain_citlr": { // exo LRRS (Le Richelain / Roussillon) // min interval of 05 seconds between each call to service
    serviceAlertsUrl: 'https://exo.chrono-saeiv.com/api/opendata/v1/LRRS/alert?token=',
    serviceAlertsUrlWithSecret: `https://exo.chrono-saeiv.com/api/opendata/v1/LRRS/alert?token=${env.MT_GTFS_RT_ca_le_richelain_citlr}`,
    vehiclePositionsUrl: 'https://exo.chrono-saeiv.com/api/opendata/v1/LRRS/vehicleposition?token=',
    vehiclePositionsUrlWithSecret: `https://exo.chrono-saeiv.com/api/opendata/v1/LRRS/vehicleposition?token=${env.MT_GTFS_RT_ca_le_richelain_citlr}`
  },
  "ca_les_moulins_mrclm": { // exo Terrebonne-Mascouche // min interval of 05 seconds between each call to service
    serviceAlertsUrl: 'https://exo.chrono-saeiv.com/api/opendata/v1/MRCLM/alert?token=',
    serviceAlertsUrlWithSecret: `https://exo.chrono-saeiv.com/api/opendata/v1/MRCLM/alert?token=${env.MT_GTFS_RT_ca_les_moulins_mrclm}`,
    vehiclePositionsUrl: 'https://exo.chrono-saeiv.com/api/opendata/v1/MRCLM/vehicleposition?token=',
    vehiclePositionsUrlWithSecret: `https://exo.chrono-saeiv.com/api/opendata/v1/MRCLM/vehicleposition?token=${env.MT_GTFS_RT_ca_les_moulins_mrclm}`
  },
  "ca_longueuil_rtl": { // RTL // min interval of 05 seconds between each call to service
    serviceAlertsUrl: 'https://rtl.chrono-saeiv.com/api/opendata/v1/RTL/alert?token=',
    serviceAlertsUrlWithSecret: `https://rtl.chrono-saeiv.com/api/opendata/v1/RTL/alert?token=${env.MT_GTFS_RT_ca_longueuil_rtl}`,
    vehiclePositionsUrl: 'https://rtl.chrono-saeiv.com/api/opendata/v1/RTL/vehicleposition?token=',
    vehiclePositionsUrlWithSecret: `https://rtl.chrono-saeiv.com/api/opendata/v1/RTL/vehicleposition?token=${env.MT_GTFS_RT_ca_longueuil_rtl}`
  },
  "ca_montreal_amt": { // exo trains // min interval of 05 seconds between each call to service
    serviceAlertsUrl: 'https://exo.chrono-saeiv.com/api/opendata/v1/TRAINS/alert?token=',
    serviceAlertsUrlWithSecret: `https://exo.chrono-saeiv.com/api/opendata/v1/TRAINS/alert?token=${env.MT_GTFS_RT_ca_montreal_amt}`,
    vehiclePositionsUrl: 'https://exo.chrono-saeiv.com/api/opendata/v1/TRAINS/vehicleposition?token=',
    vehiclePositionsUrlWithSecret: `https://exo.chrono-saeiv.com/api/opendata/v1/TRAINS/vehicleposition?token=${env.MT_GTFS_RT_ca_montreal_amt}`
  },
  "ca_richelieu_citvr": { // exo VR // min interval of 05 seconds between each call to service
    serviceAlertsUrl: 'https://exo.chrono-saeiv.com/api/opendata/v1/CITVR/alert?token=',
    serviceAlertsUrlWithSecret: `https://exo.chrono-saeiv.com/api/opendata/v1/CITVR/alert?token=${env.MT_GTFS_RT_ca_richelieu_citvr}`,
    vehiclePositionsUrl: 'https://exo.chrono-saeiv.com/api/opendata/v1/CITVR/vehicleposition?token=',
    vehiclePositionsUrlWithSecret: `https://exo.chrono-saeiv.com/api/opendata/v1/CITVR/vehicleposition?token=${env.MT_GTFS_RT_ca_richelieu_citvr}`
  },
  "ca_sherbrooke_sts": { // STS // min interval of 05 seconds between each call to service
    serviceAlertsUrl: 'https://sts.chrono-saeiv.com/api/opendata/v1/STS/alert?token=',
    serviceAlertsUrlWithSecret: `https://sts.chrono-saeiv.com/api/opendata/v1/STS/alert?token=${env.MT_GTFS_RT_ca_sherbrooke_sts}`,
    vehiclePositionsUrl: 'https://sts.chrono-saeiv.com/api/opendata/v1/STS/vehicleposition?token=',
    vehiclePositionsUrlWithSecret: `https://sts.chrono-saeiv.com/api/opendata/v1/STS/vehicleposition?token=${env.MT_GTFS_RT_ca_sherbrooke_sts}`
  },
  "ca_sorel_varennes_citsv": { // exo SV // min interval of 05 seconds between each call to service
    serviceAlertsUrl: 'https://exo.chrono-saeiv.com/api/opendata/v1/CITSV/alert?token=',
    serviceAlertsUrlWithSecret: `https://exo.chrono-saeiv.com/api/opendata/v1/CITSV/alert?token=${env.MT_GTFS_RT_ca_sorel_varennes_citsv}`,
    vehiclePositionsUrl: 'https://exo.chrono-saeiv.com/api/opendata/v1/CITSV/vehicleposition?token=',
    vehiclePositionsUrlWithSecret: `https://exo.chrono-saeiv.com/api/opendata/v1/CITSV/vehicleposition?token=${env.MT_GTFS_RT_ca_sorel_varennes_citsv}`
  },
  "ca_ste_julie_omitsju": { // exo SJU // min interval of 05 seconds between each call to service
    serviceAlertsUrl: 'https://exo.chrono-saeiv.com/api/opendata/v1/OMITSJU/alert?token=',
    serviceAlertsUrlWithSecret: `https://exo.chrono-saeiv.com/api/opendata/v1/OMITSJU/alert?token=${env.MT_GTFS_RT_ca_ste_julie_omitsju}`,
    vehiclePositionsUrl: 'https://exo.chrono-saeiv.com/api/opendata/v1/OMITSJU/vehicleposition?token=',
    vehiclePositionsUrlWithSecret: `https://exo.chrono-saeiv.com/api/opendata/v1/OMITSJU/vehicleposition?token=${env.MT_GTFS_RT_ca_ste_julie_omitsju}`
  },
  "ca_sud_ouest_citso": { // exo SO // min interval of 05 seconds between each call to service
    serviceAlertsUrl: 'https://exo.chrono-saeiv.com/api/opendata/v1/CITSO/alert?token=',
    serviceAlertsUrlWithSecret: `https://exo.chrono-saeiv.com/api/opendata/v1/CITSO/alert?token=${env.MT_GTFS_RT_ca_sud_ouest_citso}`,
    vehiclePositionsUrl: 'https://exo.chrono-saeiv.com/api/opendata/v1/CITSO/vehicleposition?token=',
    vehiclePositionsUrlWithSecret: `https://exo.chrono-saeiv.com/api/opendata/v1/CITSO/vehicleposition?token=${env.MT_GTFS_RT_ca_sud_ouest_citso}`
  }
});