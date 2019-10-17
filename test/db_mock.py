from app.file import File
from app.settings import Settings


def reset_db(db):
    db.session.query(File).delete()
    db.session.query(Settings).delete()
    db.session.commit()


def mock_db_calls(db, count):
    reset_db(db)
    for status_id in [2, 1]:
        for i in range(int(count / 2)):
            create_new_file(db, name="Downloads {}".format(i), status_id=status_id)


def create_new_file(
    db,
    name="Filename",
    directory="/downloads",
    url="http://url.com",
    status_id=1,
    log="",
    percent=50.0,
):
    file = File(
        name=name,
        directory=directory,
        url=url,
        status_id=status_id,
        log=log,
        percent=percent,
    )
    db.session.add(file)
    return file


def create_new_setting(db, key, value):
    setting = Settings(key=key, value=value)
    db.session.add(setting)
    db.session.commit()
    return setting
