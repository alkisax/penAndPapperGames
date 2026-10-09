import { useEffect, useRef, useState } from 'react'
import {
  InterstitialAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads'

import { interstitialAdUnitId } from '@/constants/constants'
import { useAdConsent } from '@/ads/context/AdConsentContext'
import { logToServer } from '@/utils/logToServer'

// const adUnitId = TestIds.INTERSTITIAL;
const adUnitId = interstitialAdUnitId

export const useInterstitialAd = () => {
  const {
    consentResolved,
    canRequestAds,
  } = useAdConsent()

  const adRef = useRef<InterstitialAd | null>(null)

  const consentResolvedRef = useRef(consentResolved)
  const canRequestAdsRef = useRef(canRequestAds)

  consentResolvedRef.current = consentResolved
  canRequestAdsRef.current = canRequestAds

  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    logToServer('INTERSTITIAL INIT')

    // Δεν φορτώνουμε διαφήμιση μέχρι να
    // ολοκληρωθεί το GDPR consent flow.
    if (!consentResolved || !canRequestAds) {
      setLoaded(false)
      adRef.current = null
      return
    }

    const ad = InterstitialAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    })

    adRef.current = ad

    const unsubLoaded = ad.addAdEventListener(
      AdEventType.LOADED,
      () => {
        setLoaded(true)
        logToServer('INTERSTITIAL LOADED')
      },
    )

    const unsubClosed = ad.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setLoaded(false)
        logToServer('INTERSTITIAL CLOSED → reload')

        // Ξαναφορτώνουμε μόνο αν
        // εξακολουθεί να επιτρέπονται ads.
        if (
          consentResolvedRef.current &&
          canRequestAdsRef.current
        ) {
          ad.load()
        }
      },
    )

    const unsubError = ad.addAdEventListener(
      AdEventType.ERROR,
      (e) => {
        logToServer(
          'INTERSTITIAL ERROR ' +
            JSON.stringify(e),
        )
      },
    )

    logToServer('INTERSTITIAL LOAD START')
    ad.load()

    return () => {
      unsubLoaded()
      unsubClosed()
      unsubError()

      adRef.current = null
    }
  }, [consentResolved, canRequestAds])

  const showAd = () => {
    if (
      consentResolvedRef.current &&
      canRequestAdsRef.current &&
      loaded &&
      adRef.current
    ) {
      logToServer('INTERSTITIAL SHOW')
      adRef.current.show()
    } else {
      logToServer('INTERSTITIAL NOT READY')
    }
  }

  return { showAd, loaded }
}