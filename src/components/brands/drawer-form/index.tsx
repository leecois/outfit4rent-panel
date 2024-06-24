import { UploadOutlined } from '@ant-design/icons';
import { getValueFromEvent, SaveButton, useDrawerForm } from '@refinedev/antd';
import type { BaseKey } from '@refinedev/core';
import { useApiUrl, useGetToPath, useGo, useTranslate } from '@refinedev/core';
import { Button, Form, Grid, Input, Segmented, Spin, Upload } from 'antd';
import { useSearchParams } from 'react-router-dom';

import type { IBrand } from '../../../interfaces';
import { Drawer } from '../../drawer';
import { useStyles } from './styled';

type Props = {
  id?: BaseKey;
  action: 'create' | 'edit';
  onClose?: () => void;
  onMutationSuccess?: () => void;
};

interface UploadResponse {
  message: string;
  statusCode: string;
  data: string;
}

export const BrandDrawerForm = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParameters] = useSearchParams();
  const go = useGo();
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const breakpoint = Grid.useBreakpoint();
  const { styles } = useStyles();

  const { drawerProps, formProps, close, saveButtonProps, formLoading } =
    useDrawerForm<IBrand>({
      resource: 'brands',
      id: props?.id, // when undefined, id will be read from the URL.
      action: props.action,
      redirect: false,
      onMutationSuccess: () => {
        props.onMutationSuccess?.();
      },
    });

  const onDrawerClose = () => {
    close();

    if (props?.onClose) {
      props.onClose();
      return;
    }

    go({
      to:
        searchParameters.get('to') ??
        getToPath({
          action: 'list',
        }) ??
        '',
      query: {
        to: undefined,
      },
      options: {
        keepQuery: true,
      },
      type: 'replace',
    });
  };

  const title = props.action === 'edit' ? null : t('brands.actions.add');

  const handleUploadChange = (info: any) => {
    const { fileList } = info;
    const updatedFileList = fileList.map((file: any) => {
      if (file.response) {
        return {
          url: (file.response as UploadResponse).data,
        };
      }
      return file;
    });
    formProps.form?.setFieldsValue({ images: updatedFileList });
  };

  return (
    <Drawer
      {...drawerProps}
      open={true}
      title={title}
      width={breakpoint.sm ? '736px' : '100%'}
      zIndex={1001}
      onClose={onDrawerClose}
    >
      <Spin spinning={formLoading}>
        <Form {...formProps} layout="vertical">
          <Form.Item
            name="images"
            valuePropName="fileList"
            getValueFromEvent={getValueFromEvent}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: 'Please upload at least one image.',
              },
            ]}
          >
            <Upload.Dragger
              name="file"
              action={`${apiUrl}/brands/uploaded-file`}
              maxCount={1}
              accept=".png,.jpg,.jpeg"
              showUploadList={true}
              onChange={handleUploadChange}
              listType="picture-card"
            >
              <Button icon={<UploadOutlined />}>
                {t('brands.fields.images.description')}
              </Button>
            </Upload.Dragger>
          </Form.Item>
          <Form.Item
            label={t('brands.fields.name')}
            name="name"
            className={styles.formItem}
            rules={[
              {
                required: true,
                message: 'Please enter the brand name.',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={t('brands.fields.description')}
            name="description"
            className={styles.formItem}
            rules={[
              {
                required: true,
                message: 'Please enter the brand description.',
              },
            ]}
          >
            <Input.TextArea rows={6} />
          </Form.Item>
          <Form.Item
            label={t('brands.fields.isFeatured')}
            name="isFeatured"
            className={styles.formItem}
            initialValue={false}
          >
            <Segmented
              block
              size="large"
              options={[
                {
                  label: t('common.yes'),
                  value: true,
                },
                {
                  label: t('common.no'),
                  value: false,
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            label={t('brands.fields.isActive.label')}
            name="status"
            className={styles.formItem}
            initialValue={0}
          >
            <Segmented
              block
              size="large"
              options={[
                {
                  label: t('common.active'),
                  value: 1,
                },
                {
                  label: t('common.inactive'),
                  value: 0,
                },
              ]}
            />
          </Form.Item>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '16px',
              padding: '16px 0',
            }}
          >
            <Button onClick={onDrawerClose}>Cancel</Button>
            <SaveButton {...saveButtonProps} htmlType="submit" type="primary">
              Save
            </SaveButton>
          </div>
        </Form>
      </Spin>
    </Drawer>
  );
};