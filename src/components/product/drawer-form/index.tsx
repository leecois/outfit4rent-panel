import { UploadOutlined } from '@ant-design/icons';
import {
  getValueFromEvent,
  SaveButton,
  useDrawerForm,
  useSelect,
} from '@refinedev/antd';
import type { BaseKey } from '@refinedev/core';
import { useApiUrl, useGetToPath, useGo, useTranslate } from '@refinedev/core';
import {
  Button,
  Flex,
  Form,
  Grid,
  Input,
  InputNumber,
  Segmented,
  Select,
  Spin,
  Upload,
} from 'antd';
import { useSearchParams } from 'react-router-dom';

import type { IBrand, ICategory, IProductList } from '../../../interfaces';
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
export const ProductDrawerForm = (props: Props) => {
  const getToPath = useGetToPath();
  const [searchParameters] = useSearchParams();
  const go = useGo();
  const t = useTranslate();
  const apiUrl = useApiUrl();
  const breakpoint = Grid.useBreakpoint();
  const { styles } = useStyles();

  const { drawerProps, formProps, close, saveButtonProps, formLoading } =
    useDrawerForm<IProductList>({
      resource: 'products',
      id: props?.id, // when undefined, id will be read from the URL.
      action: props.action,
      redirect: false,
      onMutationSuccess: () => {
        props.onMutationSuccess?.();
      },
    });

  const { selectProps: categorySelectProps } = useSelect<ICategory>({
    resource: 'categories',
  });
  const { selectProps: brandSelectProps } = useSelect<IBrand>({
    resource: 'brands',
  });

  const onDrawerCLose = () => {
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

  const title = props.action === 'edit' ? null : t('products.actions.add');

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
      onClose={onDrawerCLose}
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
              action={`${apiUrl}/products/uploaded-file`}
              multiple
              accept=".png,.jpg,.jpeg"
              showUploadList={true}
              onChange={handleUploadChange}
              listType="picture-card"
            >
              <Button icon={<UploadOutlined />}>
                {t('products.fields.images.description')}
              </Button>
            </Upload.Dragger>
          </Form.Item>
          <Flex vertical>
            <Form.Item
              label={t('products.fields.name')}
              name="name"
              className={styles.formItem}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={t('products.fields.description')}
              name="description"
              className={styles.formItem}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.TextArea rows={6} />
            </Form.Item>
            <Form.Item
              label={t('products.fields.description')}
              name="size"
              className={styles.formItem}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.TextArea rows={6} />
            </Form.Item>
            <Form.Item
              label={t('products.fields.description')}
              name="type"
              className={styles.formItem}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input.TextArea rows={6} />
            </Form.Item>
            <Form.Item
              label={t('products.fields.description')}
              name="quantity"
              className={styles.formItem}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber prefix={''} style={{ width: '150px' }} />
            </Form.Item>
            <Form.Item
              label={t('products.fields.price')}
              name="price"
              className={styles.formItem}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber prefix={'$'} style={{ width: '150px' }} />
            </Form.Item>
            <Form.Item
              label={t('products.fields.deposit')}
              name="deposit"
              className={styles.formItem}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber prefix={'$'} style={{ width: '150px' }} />
            </Form.Item>
            <Form.Item
              label={t('products.fields.category')}
              name="idCategory"
              className={styles.formItem}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select {...categorySelectProps} />
            </Form.Item>
            <Form.Item
              label={t('products.fields.brand')}
              name="idBrand"
              className={styles.formItem}
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select {...brandSelectProps} />
            </Form.Item>
            <Form.Item
              label={t('products.fields.isActive.label')}
              name="status"
              className={styles.formItem}
              initialValue={true}
            >
              <Segmented
                block
                size="large"
                options={[
                  {
                    label: t('products.fields.isActive.true'),
                    value: 1,
                  },
                  {
                    label: t('products.fields.isActive.false'),
                    value: 0,
                  },
                ]}
              />
            </Form.Item>
            <Flex
              align="center"
              justify="space-between"
              style={{
                padding: '16px 16px 0px 16px',
              }}
            >
              <Button onClick={onDrawerCLose}>Cancel</Button>
              <SaveButton
                {...saveButtonProps}
                htmlType="submit"
                type="primary"
                icon={null}
              >
                Save
              </SaveButton>
            </Flex>
          </Flex>
        </Form>
      </Spin>
    </Drawer>
  );
};
