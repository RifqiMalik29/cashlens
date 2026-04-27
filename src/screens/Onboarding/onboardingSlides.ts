import { type TFunction } from "i18next";

export function getOnboardingSlides(t: TFunction) {
  return [
    {
      id: "1",
      title: t("onboarding.slide1Title"),
      subtitle: t("onboarding.slide1Subtitle"),
      iconName: "Wallet"
    },
    {
      id: "2",
      title: t("onboarding.slide2Title"),
      subtitle: t("onboarding.slide2Subtitle"),
      iconName: "ScanLine"
    },
    {
      id: "3",
      title: t("onboarding.slide3Title"),
      subtitle: t("onboarding.slide3Subtitle"),
      iconName: "Target"
    }
  ];
}
