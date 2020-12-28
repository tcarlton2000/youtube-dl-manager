from app.file import File
from app.settings import Settings


def reset_db(db):
    db.session.query(File).delete()
    db.session.query(Settings).delete()
    db.session.commit()


def create_file_list(db, in_progress_count=0, completed_count=0, error_count=0):
    reset_db(db)

    for i in range(error_count):
        create_new_file(db, name=f"Error {i}", status_id=3)

    for i in range(completed_count):
        create_new_file(db, name=f"Completed {i}", status_id=2)

    for i in range(in_progress_count):
        create_new_file(db, name=f"In Progress {i}", status_id=1)


def create_new_file(
    db,
    name="Filename",
    directory="/downloads",
    url="http://url.com",
    status_id=1,
    type_id=1,
    percent=50.0,
):
    file = File(
        name=name,
        directory=directory,
        url=url,
        status_id=status_id,
        type_id=type_id,
        percent=percent,
    )
    db.session.add(file)
    return file


def create_new_setting(db, key, value):
    setting = Settings(key=key, value=value)
    db.session.add(setting)
    db.session.commit()
    return setting
