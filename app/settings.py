from app.main import db

DEFAULTS = {"downloadDirectory": "/downloads"}


class Settings(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    key = db.Column(db.String, index=True, unique=True)
    value = db.Column(db.String)

    @classmethod
    def get_settings(cls):
        settings = Settings.query.all()
        settings_json = {setting.key: setting.value for setting in settings}

        for key, value in DEFAULTS.items():
            if key not in settings_json:
                settings_json[key] = value

        return {"settings": settings_json}

    @classmethod
    def update_settings(cls, new_settings):
        for key, value in new_settings["settings"].items():
            existing_setting = Settings.query.filter(Settings.key == key).first()

            if existing_setting is None:
                setting = Settings(key=key, value=value)
                db.session.add(setting)
            else:
                existing_setting.value = value

        db.session.commit()

    @classmethod
    def get_setting(cls, key):
        setting = Settings.query.filter(Settings.key == key).first()
        if setting is None:
            return DEFAULTS[key]
        else:
            return setting.value
