import { useT } from '../../i18n/I18nProvider.jsx';
import { useStudio } from '../StudioContext.jsx';
import { SwatchRow, PickRow, Check, HintLine } from '../Fields.jsx';
import { CUSTOM_FONTS } from '../../lib/renderCustom.js';

export default function Look() {
  const { c, field, demo, say } = useStudio();
  const t = useT();
  const fonts = Object.keys(CUSTOM_FONTS).map((k) => [k, CUSTOM_FONTS[k].label, '']);

  const resetLook = () => {
    field('accent', demo.accent || '#0E7C5A');
    field('ink', demo.ink || '#101820');
    field('mode', demo.mode || 'light');
    say(`Colours back to ${demo.name || 'the design'}.`);
  };

  return (
    <>
      <div className="g2">
        <SwatchRow k="accent" label="Main colour" />
        <SwatchRow k="ink" label="Text / dark colour" />
      </div>
      <PickRow k="mode" label="Background" opts={[['light', 'Light', 'White page'], ['dark', 'Dark', 'Dark page']]} />
      <PickRow k="font" label="Typeface" opts={fonts} />
      <PickRow k="radius" label="Corners" opts={[['sharp', 'Sharp', '0px'], ['soft', 'Soft', '12px'], ['round', 'Round', '24px']]} />
      <PickRow
        k="layout"
        label="Top of the page"
        opts={[['split', 'Text + photo', 'Side by side'], ['center', 'Centred', 'Photo below'], ['image', 'Big photo', 'Text over it']]}
      />
      <Check checked={c.topbar} onChange={(v) => field('topbar', v)}>
        {t('Show the hours and phone strip at the very top')}
      </Check>
      <HintLine>
        {t('Colours started from')} <strong>{demo.name || ''}</strong>. {t('Change anything — the preview follows.')}{' '}
        <button type="button" className="linkbtn" onClick={resetLook}>{t('Reset to the design')}</button>
      </HintLine>
    </>
  );
}
