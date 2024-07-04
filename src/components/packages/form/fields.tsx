import {
  EditOutlined,
  MailOutlined,
  PhoneOutlined,
  RightCircleOutlined,
} from '@ant-design/icons';
import type { UseFormReturnType } from '@refinedev/antd';
import { DeleteButton, ListButton, SaveButton } from '@refinedev/antd';
import type { UseFormProps } from '@refinedev/core';
import { useNavigation, useTranslate } from '@refinedev/core';
import type { InputRef } from 'antd';
import { Button, Card, Divider, Form, Input, Segmented, Tag } from 'antd';
import { useEffect, useRef } from 'react';

import type { IPackage } from '../../../interfaces';
import { FormItemEditable, FormItemHorizontal } from '../../form';
import { PackageStatus } from '../status';

type Props = {
  formProps: UseFormReturnType<IPackage>['formProps'];
  saveButtonProps: UseFormReturnType<IPackage>['saveButtonProps'];
  action: UseFormProps['action'];
  isFormDisabled: boolean;
  setIsFormDisabled: (value: boolean) => void;
};

export const PackageFormFields = ({
  formProps,
  saveButtonProps,
  action,
  isFormDisabled,
  setIsFormDisabled,
}: Props) => {
  const titleInputRef = useRef<InputRef>(null);

  const t = useTranslate();
  const { list } = useNavigation();

  useEffect(() => {
    if (!isFormDisabled) {
      titleInputRef.current?.focus();
    }
  }, [isFormDisabled]);

  const statusField = Form.useWatch('status', formProps.form);
  const isFeaturedField = Form.useWatch('isFeatured', formProps.form);

  return (
    <Form {...formProps} layout="horizontal" disabled={isFormDisabled}>
      <FormItemEditable
        formItemProps={{
          name: 'name',
          style: {
            marginBottom: '32px',
          },
          rules: [
            {
              required: true,
              message: 'Please input the name!',
            },
          ],
        }}
      >
        <Input
          ref={titleInputRef}
          size="large"
          placeholder={t('packages.fields.name')}
        />
      </FormItemEditable>
      <Card
        bodyStyle={{
          padding: 0,
        }}
      >
        <FormItemHorizontal
          name="status"
          initialValue={0}
          icon={<RightCircleOutlined />}
          label={t('packages.fields.status.label')}
        >
          {isFormDisabled ? (
            <PackageStatus value={statusField} />
          ) : (
            <Segmented
              options={[
                {
                  label: t('partners.fields.status.inactive'),
                  value: 0,
                },
                {
                  label: t('partners.fields.status.active'),
                  value: 1,
                },
              ]}
            />
          )}
        </FormItemHorizontal>
        <Divider
          style={{
            margin: 0,
          }}
        />
        <FormItemHorizontal
          name="isFeatured"
          initialValue={false}
          icon={<RightCircleOutlined />}
          label={t('packages.fields.isFeatured.label')}
        >
          {isFormDisabled ? (
            <Tag color={isFeaturedField ? 'blue' : 'grey'}>
              {isFeaturedField ? 'Featured' : 'Not Featured'}
            </Tag>
          ) : (
            <Segmented
              options={[
                { label: t('partners.fields.status.inactive'), value: false },
                { label: t('partners.fields.status.active'), value: true },
              ]}
            />
          )}
        </FormItemHorizontal>
        <Divider
          style={{
            margin: 0,
          }}
        />
        <FormItemHorizontal
          icon={<MailOutlined />}
          label={t('packages.fields.availableRentDays')}
          name="availableRentDays"
          rules={[
            {
              required: true,
              message: 'Please input a valid number of days!',
            },
          ]}
        >
          <Input type="number" />
        </FormItemHorizontal>
        <Divider
          style={{
            margin: 0,
          }}
        />
        <FormItemHorizontal
          name="price"
          icon={<PhoneOutlined />}
          label={t('packages.fields.price')}
          rules={[
            {
              required: true,
              message: 'Please input a valid price!',
            },
          ]}
        >
          <Input type="number" />
        </FormItemHorizontal>
        <Divider
          style={{
            margin: 0,
          }}
        />
        <FormItemHorizontal
          name="numOfProduct"
          icon={<PhoneOutlined />}
          label={t('packages.fields.numOfProduct')}
          rules={[
            {
              required: true,
              message: 'Please input a valid number of products!',
            },
          ]}
        >
          <Input type="number" />
        </FormItemHorizontal>
        <Divider
          style={{
            margin: 0,
          }}
        />
        <FormItemHorizontal
          name="description"
          icon={<PhoneOutlined />}
          label={t('packages.fields.description')}
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Input.TextArea rows={4} />
        </FormItemHorizontal>
      </Card>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '16px 16px 0px 16px',
        }}
      >
        {action === 'create' && (
          <>
            <ListButton icon={false}>{t('actions.cancel')}</ListButton>
            <SaveButton
              {...saveButtonProps}
              style={{
                marginLeft: 'auto',
              }}
              htmlType="submit"
              type="primary"
              icon={null}
            >
              Save
            </SaveButton>
          </>
        )}
        {action === 'edit' &&
          (isFormDisabled ? (
            <>
              <DeleteButton
                type="text"
                onSuccess={() => {
                  list('partners');
                }}
                style={{
                  marginLeft: '-16px',
                }}
              />
              <Button
                style={{
                  marginLeft: 'auto',
                }}
                disabled={false}
                icon={<EditOutlined />}
                onClick={() => {
                  setIsFormDisabled(false);
                }}
              >
                {t('actions.edit')}
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => {
                  setIsFormDisabled(true);
                }}
              >
                {t('actions.cancel')}
              </Button>
              <SaveButton
                {...saveButtonProps}
                style={{
                  marginLeft: 'auto',
                }}
                htmlType="submit"
                type="primary"
                icon={null}
              >
                Save
              </SaveButton>
            </>
          ))}
      </div>
    </Form>
  );
};
