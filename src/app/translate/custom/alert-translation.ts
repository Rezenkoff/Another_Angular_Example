﻿import { InjectionToken } from "@angular/core";

export let ALERT_TRANSLATIONS = new InjectionToken("AlertTranslations");

export interface IAlertTranslations {
    ERRORS: any,
    SUCCESS: any,
    MESSAGE: any
}

export const translations: IAlertTranslations = {
    ERRORS: {
        "default": "Неизвестная ошибка",

        //Russian translations:
        "default_RUS": "Неизвестная ошибка",
        "passwords_not_match_RUS": "Введённые пароли не совпадают",
        "Incorrect password._RUS": "Неправильный текущий пароль",
        "invalid_username_or_password_RUS": "Неверное имя или пароль",
        "user_not_found_RUS": "Пользователь не найден",
        "email_not_available_RUS": "Такой e-mail уже существует",
        "change_email_fail_RUS": "Ошибка изменения E-mail",
        "user_update_fail_RUS": "Ошибка изменения имени",
        "DuplicateUserName_RUS": "Пользователь с таким телефоном уже зарегистрирован",
        "DuplicateEmail_RUS": "Пользователь с таким e-mail уже зарегистрирован",
        "InvalidEmail_RUS": "Некорректный e-mail",
        "sms_count_over_RUS": "Вы использовали все SMS. Попробуйте позже!",
        "unknown_error_RUS": "Произошла ошибка. Попробуйте позже!",
        "invalid_confirmation_code_RUS": "Некорректный код подтверждения!",
        "invoice_not_found_RUS": "Счёт не найден",
        "user_creation_failed_RUS": "Ошибка при создании аккаунта",
        "server_error_RUS": "Ошибка сервера",
        "something_wrong_RUS": "Что-то пошло не так...",
        "try_later_RUS": "Ошибка, попробуйте повторить позже",
        "max_file_size_exceeded_RUS": "Превышен максимальный размер файлов",
        "invoise_post_error_RUS": "При обработке заказа произошла ошибка",
        "vin_not_found_RUS": "По данному vin ничего не найдено. Выполните поиск по авто",
        "update failed_RUS": "Ошибка обновления ТПК",
        "order_contact_info_RUS": "Заполните контактные данные!",
        "order_info_RUS": "Заполните все поля!",
        "is_process_RUS": "Обработка!",
        "total_item_RUS": "Добавьте товары в корзину!",
        "vehicle_already_added_RUS": "Данный автомобиль уже добавлен!",
        "file_operation_exception_RUS": "Ошибка записи в файл редиректов!",
        "cycled_link_RUS": "Обнаружена циклическая ссылка!",
        "order_reservation_error_RUS": "Ошибка при резервировании товаров!",
        "external_invoice_error_RUS": "Ошибка при создании счета!",
        "order_creation_error_RUS": "Ошибка при создании заказа!",
        "phone_number_empty_RUS": "Пустой номер телефона!",
        "user_creation_error_RUS": "Ошибка при создании пользователя!",
        "no_available_products_RUS": "Выбранных товаров нет в наличии",
        "spec_prop_change_fail_RUS": "Ошибка при сохранении изменений",
        "subscription_already_exist_RUS": "Спасибо, вы уже подписаны на наши новости",
        "can_not_be_shipped_by_courier_RUS": "Присутствуют товары, которые нельзя отгружать курьерской службой! Выберите доставку на СТО",
        "invoice_shipped_RUS": "Счет в статусе \"Готов к отгрузке\"/\"Отгружен\". Изменения в счет не внесены.",
        "invoice_add_error_RUS": "Ошибка при прикреплении счета!",
        "review_add_error_RUS": "Ошибка при сохранении отзыва!",
        "car_number_not_found_RUS": "По данному номеру ничего не найдено !",
        "no_changes_detected_RUS": "Не найдено изменений",
        "cannot_apply_changes_because_manager_is_not_selected_RUS": "Невозможно применить именения, потому что менеджер не выбран",
        "wrong_discount_RUS": "Промокод неверный или не действителен для этого заказа",
        "invalid_discount_RUS": "Промокод недействительный",
        "phone_number_not_found_for_email_change_RUS": "Не удалось сохранить Email, авторизируйтесь и попробуйте снова",
        "invoiceCreationFailed_RUS": "Заказ принят, менеджер свяжется в ближайшее время",
        "otp_code_has_not_expired_RUS": "Код уже отправлен повторите позже",
        "password_reset_error_RUS":"Не возможно изменить пароль",

        //Ukrainian translations:
        "default_UKR": "Невiдома помилка",
        "passwords_not_match_UKR": "Введенi паролi не спiвпадають",
        "Incorrect password._UKR": "Невiрний поточний пароль",
        "invalid_username_or_password_UKR": "Невiрне iм'я або пароль",
        "user_not_found_UKR": "Користувача не знайдено",
        "email_not_available_UKR": "Такий e-mail вже iснує",
        "change_email_fail_UKR": "Помилка при змiнi E-mail",
        "user_update_fail_UKR": "Помилка при змiнi iм'я",
        "DuplicateUserName_UKR": "Користувач з таким телефоном вже зареєстрований",
        "DuplicateEmail_UKR": "Користувач з таким e-mail  вже зареєстрований",
        "InvalidEmail_UKR": "Некоректний e-mail",
        "sms_count_over_UKR": "Вы використали всi SMS. Cпробуйте пiзнiше!",
        "unknown_error_UKR": "Виникли проблеми. Cпробуйте пiзнiше!",
        "invalid_confirmation_code_UKR": "Некоректный код для пiдтвердження!",
        "invoice_not_found_UKR": "Рахунок не знайдено",
        "user_creation_failed_UKR": "Помилка при створеннi аккаунта",
        "server_error_UKR": "Помилка сервера",
        "something_wrong_UKR": "Щось пiшло не так...",
        "try_later_UKR": "Помилка, спробуйте пiзнiше",
        "max_file_size_exceeded_UKR": "Превищено максимальний розмiр файлiв",
        "invoise_post_error_UKR": "При обробці замовлення виникла помилка",
        "vin_not_found_UKR": "За даним vin нічого не знайдено",
        "update failed_UKR": "Помилка оновлення ТПК",
        "order_contact_info_UKR": "Заповніть контактнi данi!",
        "order_info_UKR": "Заповніть всі поля!",
        "is_process_UKR": "Обробка!",
        "total_item_UKR": "Додайте товари у кошик!",
        "vehicle_already_added_UKR": "Даний автомобіль вже доданий!",
        "file_operation_exception_UKR": "Помилка запису у файл редиректiв!",
        "cycled_link_UKR": "Виявлено циклiчне посилання!",
        "order_reservation_error_UKR": "Помилка  при резервуванні товарів!",
        "external_invoice_error_UKR": "Помилка при створенні рахунку!",
        "order_creation_error_UKR": "помилка при створенні замовлення!",
        "phone_number_empty_UKR": "Пустий номер телефону!",
        "user_creation_error_UKR": "Помилка при створенні користувача!",
        "no_available_products_UKR": "Обраних товарiв немає у наявностi",
        "spec_prop_change_fail_UKR": "Помилка при збереженнi змiн",
        "subscription_already_exist_UKR": "Дякуємо, ви вже підписані на наші новини",
        "can_not_be_shipped_by_courier_UKR": "Присутні товари, які не можна відправляти курьерською службою! Виберіть доставку на СТО.",
        "invoice_shipped_UKR": "Рахунок в статусі \"Готовий до відвантаження\"/\"Відвантажений\". Зміни до рахунку не внесені.",
        "invoice_add_error_UKR": "Помилка при прикріпленні рахунку!",
        "review_add_error_UKR": "Помилка при збереженнi вiдгуку!",
        "car_number_not_found_UKR": "За даним номером нічого не знайдено!",
        "no_changes_detected_UKR": "Не знайдено змін",
        "cannot_apply_changes_because_manager_is_not_selected_UKR": "Неможливо застосувати змiни, тому що менеджер не обраний",
        "wrong_discount_UKR": "Промокод невірний або не дійсний для цього замовлення",
        "invalid_discount_UKR": "Промокод недійсний",
        "phone_number_not_found_for_email_change_UKR": "Неможливо зберегти Email, авторизуйтесь і спробуйте знову",
        "invoiceCreationFailed_UKR": "Замовлення прийнято, менеджер зв'яжеться найближчим часом",
        "otp_code_has_not_expired_UKR": "Код вже відправлено спробуйте пізніше",
        "password_reset_error_UKR":"Не можливо змінити пароль",
    },
    SUCCESS: {
        "default": "Операция прошла успешно",

        //Russian translations:
        "default_RUS": "Операция прошла успешно",
        "password_sent_email_RUS": "Спасибо за регистрацию! Пароль был отправлен на Ваш E-mail",
        "password_sent_sms_RUS": "Спасибо за регистрацию!",
        "password_changed_RUS": "Ваш пароль изменён",
        "reset_info_sent_RUS": "Информация для восстановления пароля отправлена на Ваш E-mail",
        "temporary_password_sent_RUS": "Вам отправлено смс с временным паролем!",
        "invoice_removed_RUS": "Счёт удалён",
        "user_created_RUS": "Пользователь успешно обновлён",
        "user_updated_RUS": "Пользователь успешно обновлён",
        "empty_invoice_created_RUS": "Пустой счёт успешно создан",
        "delivery_point_edited_RUS": "Точка выдачи успешно отредактирована",
        "redirect_added_RUS": "Редирект добавлен",
        "redirect_edited_RUS": "Редирект отредактирован",
        "redirect_removed_RUS": "Редирект удален",
        "token_generated_RUS": "Токен сгенерирован",
        "success_callback_RUS": "Спасибо, в ближайшее время с вами свяжется наш оператор",
        "subscription_added_RUS": "Спасибо за подписку",
        "invoise_post_success_RUS": "Спасибо за обращение, ваша заявка принята, в ближайшее время с вами свяжется наш оператор.",
        "article_added_RUS": "Статья успешно добавлена",
        "article_updated_RUS": "Статья успешно обновлена",
        "article_removed_RUS": "Статья удалена",
        "changes_applied_RUS": "Изменения заказа сохранены",
        "spec_prop_changed_RUS": "URL изображения изменен. Обновите страницу чтобы увидеть изменения",
        "phone_field_empty_RUS": "Введите номер телефона",
        "order_created_RUS": "Заказ успешно создан",
        "order_price_changed_RUS": "Стоимость заказа снижена на ",
        "review_add_success_RUS": "Спасибо за Ваш комментарий. После проверки модератором он будет опубликован.",
        "discount_activated_RUS": "Промокод активирован",

        //Ukrainian translations:
        "default_UKR": "Операцiя пройшла успiшно",
        "password_sent_email_UKR": "Дякуємо за реєстрацiю! Пароль было вiдправлено на Ваш E-mail",
        "password_sent_sms_UKR": "Дякуємо за реєстрацiю!",
        "password_changed_UKR": "Ваш пароль було змiнено",
        "reset_info_sent_UKR": "Iнформацiю для вiдновлення паролю було вiдправлено на Ваш E-Mail",
        "temporary_password_sent_UKR": "Вам вiдправлено смс з тимчасовим паролем!",
        "invoice_removed_UKR": "Рахунок видалено",
        "user_created_UKR": "Користувач успiшно оновлений",
        "user_updated_UKR": "Користувач успiшно оновлений",
        "empty_invoice_created_UKR": "Пустий рахунок успiшно створено",
        "delivery_point_edited_UKR": "Точку видачi успiшно вiдредаговано",
        "redirect_added_UKR": "Редiрект створено",
        "redirect_edited_UKR": "Редiрект вiдредаговано",
        "redirect_removed_UKR": "Редiрект видалено",
        "token_generated_UKR": "Токен сгенеровано",
        "success_callback_UKR": "Дякуємо, найближчим часом вам зателефонує наш оператор.",
        "subscription_added_UKR": "Дякуємо за пiдписку",
        "invoise_post_success_UKR": "Дякуємо за звернення, вашу заяву прийнято, найближчим часом вам зателефонує наш оператор.",
        "article_added_UKR": "Статтю успiшно створено",
        "article_updated_UKR": "Статтю успiшно оновлено",
        "article_removed_UKR": "Статтю видалено",
        "changes_applied_UKR": "Змiни до замовлення збережено",
        "spec_prop_changed_UKR": "URL зображення змiнено. Оновiть сторiнку щоб побачити змiни",
        "phone_field_empty_UKR": "Введіть номер телефону",
        "order_created_UKR": "Замовлення успiшно створено",
        "order_price_changed_UKR": "Вартiсть замовлення знижено на ",
        "review_add_success_UKR": "Дякуємо за Ваш коментар. Його буде опублiковано пiсля перевiрки модератором.",
        "discount_activated_UKR": "Промокод активований",
    },
    MESSAGE: {

        //Russian translations:
        "add_to_favorite_RUS": "Добавлен в избранное, список избранных товаров доступен в личном кабинете",
        "remove_from_favorite_RUS": "Удален из избранного",
        "group_without_products_RUS": "Отсутствуют товары в данной группе",
        "order_price_changed_RUS": "Цена уточнена. Изменена на +",

        //Ukrainian translations:
        "add_to_favorite_UKR": "Доданий до обраних, список обраних товарів доступний в особистому кабінеті",
        "remove_from_favorite_UKR": "Видалений з обраних",
        "group_without_products_UKR": "Відсутні товари в даній групі",
        "order_price_changed_UKR": "Цiну уточнено. Змiнена на +",

    }
};