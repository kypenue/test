API_PREFIX_V1 = "/api/v1"
AUTH_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_SECONDS = 60 * 60 * 24 * 120

TIME_FORMAT = "%Y-%m-%d %H:%M:%S"
TIME_FORMAT_BIRTH_DATE = "%d.%m.%Y"

NOT_ENOUGH_PERMISSIONS_MSG = "Недостаточно прав для выполнения действия"
NOT_FOUND_MSG = "Объект не найден"
UPLOAD_ERROR_MSG = "Ошибка при загрузке файла"
TOURNAMENT_NOT_REGISTERED_MSG = "Для доступа необходимо быть зарегистрированным на турнир"

MATCH_RESULT_PROHIBITED_MSG = "Вам недоступно редактирование результатов для данного матча"
MATCH_RESULT_PROHIBITED_FOR_FINISHED_MSG = "Недоступно редактирование результатов для подтверждённого матча"
MATCH_RESULT_TOO_MANY_ITEMS_MSG = "Более двух результатов для матча"
MATCH_RESULT_ORGANIZER_FILLED_MSG = "Организатор уже ввёл результаты данного матча"

MATCH_COMPLAINT_PROHIBITED_MSG = "Вам недоступно создание жалобы по данному матчу"

SERIES_FEEDBACK_ALREADY_EXISTS_MSG = "Вы уже оставляли обратную связь для данной серии"
SERIES_FEEDBACK_NO_MATCHES_MSG = "Не удалось оставить обратную связь, так как в данной серии нет матчей"

# telegram verification messages
TG_ACCOUNT_VERIFIED = (
    "✅ Аккаунт был успешно подтвержден! Вы можете перейти обратно на сайт."
)
TG_TOKEN_NOT_FOUND_MSG = (
    "❗К сожалению, что-то пошло не так... Попробуйте получить новую ссылку для верификации аккаунта."
)
TG_ANOTHER_USERNAME_SPECIFIED_MSG = (
    "❗Произошла ошибка верификации. Вы указали аккаунт «{specified}», однако юзернейм текущего аккаунта – «{received}»."
    "\n\nВы можете получить новую ссылку для данного юзернейма или перейти по текущей под указанным аккаунтом."
)
TG_TOKEN_ALREADY_USED_MSG = (
    "❗К сожалению, данная ссылка уже была использована. Попробуйте получить новую."
)
TG_TOKEN_EXPIRED_MSG = (
    "❗К сожалению, время жизни данной ссылки истекло. Попробуйте получить новую."
)
TG_USER_ALREADY_EXISTS_MSG = (
    "❗Ошибка верификации. Данный телеграм уже привязан к другому аккаунту."
)
TG_UNKNOWN_ERROR_MSG = (
    "❗К сожалению, что-то пошло не так... Попробуйте получить новую ссылку для верификации аккаунта."
)
