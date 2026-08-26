import { LetterContent, ThemeId } from '../types';
import OceanTheme from './themes/OceanTheme';
import SunsetTheme from './themes/SunsetTheme';
import SkyTheme from './themes/SkyTheme';
import LakeTheme from './themes/LakeTheme';

interface Props {
  theme: ThemeId;
  content: LetterContent;
}

export default function ThemeRenderer({ theme, content }: Props) {
  switch (theme) {
    case 'ocean':
      return <OceanTheme content={content} />;
    case 'sunset':
      return <SunsetTheme content={content} />;
    case 'sky':
      return <SkyTheme content={content} />;
    case 'lake':
      return <LakeTheme content={content} />;
    default:
      return null;
  }
}
