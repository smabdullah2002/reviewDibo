from app.database import SessionLocal, engine, Base
from app.models import User, Product, Review
from app.auth import hash_password


products_data = [
    {"title": "Wireless Mouse", "description": "Ergonomic wireless mouse with long battery life", "image_url": "https://picsum.photos/seed/mouse/400/300"},
    {"title": "Mechanical Keyboard", "description": "RGB mechanical keyboard with blue switches", "image_url": "https://picsum.photos/seed/keyboard/400/300"},
    {"title": "USB-C Hub", "description": "7-in-1 USB-C hub with HDMI and SD card reader", "image_url": "https://picsum.photos/seed/hub/400/300"},
    {"title": "Noise Cancelling Headphones", "description": "Over-ear headphones with active noise cancellation", "image_url": "https://picsum.photos/seed/headphones/400/300"},
    {"title": "Portable SSD", "description": "1TB external SSD with USB 3.2", "image_url": "https://picsum.photos/seed/ssd/400/300"},
    {"title": "Webcam HD", "description": "1080p webcam with built-in microphone", "image_url": "https://picsum.photos/seed/webcam/400/300"},
    {"title": "Laptop Stand", "description": "Adjustable aluminum laptop stand", "image_url": "https://picsum.photos/seed/stand/400/300"},
    {"title": "Bluetooth Speaker", "description": "Portable waterproof bluetooth speaker", "image_url": "https://picsum.photos/seed/speaker/400/300"},
    {"title": "Monitor Arm", "description": "Gas spring monitor arm for 17-32 inch screens", "image_url": "https://picsum.photos/seed/monarm/400/300"},
    {"title": "Desk Mat", "description": "Large waterproof desk mat with stitched edges", "image_url": "https://picsum.photos/seed/deskmat/400/300"},
]

reviews_data = [
    {"rating": 5, "comment": "Great quality, highly recommend"},
    {"rating": 4, "comment": "Good value for the price"},
    {"rating": 3, "comment": "Decent but could be better"},
    {"rating": 5, "comment": "Exceeded my expectations"},
    {"rating": 2, "comment": "Not what I expected"},
    {"rating": 4, "comment": "Works well, no complaints"},
    {"rating": 1, "comment": "Stopped working after a week"},
    {"rating": 5, "comment": "Perfect, exactly what I needed"},
    {"rating": 3, "comment": "It's okay, nothing special"},
    {"rating": 4, "comment": "Solid build, good purchase"},
]

user_data = [
    {"name": "Alice Johnson", "email": "alice@example.com", "password": "password123"},
    {"name": "Bob Smith", "email": "bob@example.com", "password": "password123"},
    {"name": "Charlie Brown", "email": "charlie@example.com", "password": "password123"},
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    if db.query(User).first():
        print("Database already has data, skipping seed.")
        db.close()
        return

    admin = User(name="Administrator", email="admin@example.com", password_hash=hash_password("admin123"), is_admin=1)
    db.add(admin)

    users = []
    for u in user_data:
        user = User(name=u["name"], email=u["email"], password_hash=hash_password(u["password"]))
        db.add(user)
        users.append(user)

    db.flush()

    products = []
    for p in products_data:
        product = Product(title=p["title"], description=p["description"], image_url=p["image_url"])
        db.add(product)
        products.append(product)

    db.flush()

    all_users = [admin] + users
    for i, product in enumerate(products):
        for j, user in enumerate(all_users):
            review_data = reviews_data[(i + j) % len(reviews_data)]
            review = Review(
                product_id=product.id,
                user_id=user.id,
                rating=review_data["rating"],
                comment=review_data["comment"],
            )
            db.add(review)

    db.commit()
    db.close()

    print(f"Seeded: 1 admin, {len(users)} users, {len(products)} products, {len(products) * len(all_users)} reviews")


if __name__ == "__main__":
    seed()
