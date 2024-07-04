/* eslint-disable @typescript-eslint/no-shadow */
import { useForm } from '@refinedev/antd';
import axios from 'axios';
import { useEffect, useState } from 'react';

import type {
  ICategory,
  ICategoryPackage,
  IPackage,
} from '../../../interfaces';

type Props = {
  action: 'create' | 'edit';
};

export const usePackageForm = (props: Props) => {
  const [isFormDisabled, setIsFormDisabled] = useState<boolean>(
    props.action === 'edit',
  );
  const [packageData, setPackageData] = useState<IPackage | null>(null);
  const [categoryPackageWithCategory, setCategoryPackageWithCategory] =
    useState<Array<{ categoryPackage: ICategoryPackage; category: ICategory }>>(
      [],
    );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<IPackage>({
    action: props.action,
    redirect: false,
    onMutationSuccess: () => {
      setIsFormDisabled(true);
    },
  });

  useEffect(() => {
    const fetchPackageData = async () => {
      setLoading(true);
      try {
        const packageId = form.queryResult?.data?.data?.id;
        if (!packageId) {
          console.error('packageId is undefined or null');
          setError('Invalid package ID');
          setLoading(false);
          return;
        }

        const packageResponse = await axios.get(
          `https://api.outfit4rent.online/packages/${packageId}`,
        );
        setPackageData(packageResponse.data.data);

        const categoryPackagesResponse = await axios.get(
          `https://api.outfit4rent.online/category-packages/by-package-id/${packageId}`,
        );
        const fetchedCategoryPackages: ICategoryPackage[] =
          categoryPackagesResponse.data.data;

        const categoryIds = fetchedCategoryPackages.map(
          (pkg) => pkg.categoryId,
        );
        const categoriesResponse = await Promise.all(
          categoryIds.map((id) =>
            axios.get(`https://api.outfit4rent.online/categories/${id}`),
          ),
        );

        const combinedData = fetchedCategoryPackages.map((pkg) => {
          const category = categoriesResponse.find(
            (res) => res.data.data.id === pkg.categoryId,
          )?.data.data;

          return {
            categoryPackage: pkg,
            category: category || ({} as ICategory),
          };
        });

        setCategoryPackageWithCategory(combinedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchPackageData();
  }, [props.action, form.queryResult?.data?.data?.id]);

  const handleSetIsFormDisabled = (value: boolean) => {
    form.formProps.form?.resetFields();
    setIsFormDisabled(value);
  };

  return {
    ...form,
    packageData,
    categoryPackageWithCategory,
    loading,
    error,
    isFormDisabled,
    setIsFormDisabled: handleSetIsFormDisabled,
  };
};
