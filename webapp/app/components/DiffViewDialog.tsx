import { Button, Modal } from 'semantic-ui-react';
import { EditContext } from './EditContext';
import Loading from './Loading';
import I18n from '~/translations';
import { useApp } from '~/app.context';
import { useContext } from 'react';

const DiffViewDialog = () => {
  const app = useApp();
  const { activeDialog, setActiveDialog } = app;
  const edit = useContext(EditContext);
  if (!edit) {
    return null;
  }

  const { editSong, diffView } = edit;

  return (
    <Modal
      open={activeDialog === 'diffView'}
      size="large"
      dimmer="blurring"
      centered={false}
      onClose={() => setActiveDialog()}>
      <Modal.Header>{I18n.t('ui.diff view')}</Modal.Header>
      <Modal.Content scrolling>
        {editSong && <h5>{editSong.titulo.toUpperCase()}</h5>}
        <div style={{ flex: 1 }}>
          {diffView &&
            diffView.map((item, i) => {
              const colorName = item.added
                ? 'green'
                : item.removed
                ? 'red'
                : 'grey';
              const val = item.value.replace(/\n/g, '<br/>');
              return (
                <span
                  key={i}
                  style={{
                    fontFamily: 'monospace',
                    whiteSpace: 'pre',
                    color: colorName,
                  }}
                  dangerouslySetInnerHTML={{ __html: val }}
                />
              );
            })}
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button negative onClick={() => setActiveDialog()}>
          {I18n.t('ui.close')}
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default DiffViewDialog;
