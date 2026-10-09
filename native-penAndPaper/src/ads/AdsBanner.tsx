import {
  BannerAd,
  BannerAdSize,
  TestIds,
} from 'react-native-google-mobile-ads'
import { View } from 'react-native'

import { bannerAdUnitId } from '@/constants/constants'
import { useAdConsent } from '@/ads/context/AdConsentContext'
import { logToServer } from '@/utils/logToServer'

const adUnitId = bannerAdUnitId
// const adUnitId = TestIds.BANNER

const AdsBanner = () => {
  const {
    consentResolved,
    canRequestAds,
  } = useAdConsent()

  // Δεν δημιουργούμε Banner μέχρι
  // να ολοκληρωθεί το GDPR consent flow.
  if (!consentResolved || !canRequestAds) {
    return null
  }

  return (
    <View style={{ alignItems: 'center' }}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.FULL_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() =>
          logToServer('BANNER LOADED')
        }
        onAdFailedToLoad={(e) =>
          logToServer(
            'BANNER ERROR ' +
            JSON.stringify(e),
          )
        }
      />
    </View>
  )
}

export default AdsBanner