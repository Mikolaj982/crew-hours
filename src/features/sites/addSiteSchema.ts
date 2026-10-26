import * as yup from 'yup';

export const addSiteSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .max(60, 'Nazwa budowy przekracza maksymalną liczbę znaków: 60')
    .required('Nazwa budowy jest wymagana'),
});

export type SiteData = yup.InferType<typeof addSiteSchema>;
